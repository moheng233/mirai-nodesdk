// @flow
import fly from "flyio";
// import WebSocket from "ws";
import WebSocket from "ws";
import messageChain from "./messageChain";
import { EventEmitter } from "events";
import { ImessageObject } from "./messageObject";
import { commandProcessor } from "./commandProcessor";
import { IregistCommands } from "./registCommands";

/**
 * 机器人的基础类
 */
export default class Mirai extends EventEmitter implements IregistCommands {
    authKey: String = "";
    host: String = "";
    port: String = "";
    qq: String = "";
    passwd: String = "";
    session: String = "";
    commandSymbol: String = "#";
    GetInit= false;
    wsMessage!: WebSocket;

    commandList: commandProcessor[] = [];

    

    /**
     * 机器人的基础类
     * 所有的东西都在这里了
     */
    constructor (config: { authKey: String; host: String; port: String; qq?: String; passwd?: String; }){
        super();

        this.authKey = config.authKey;
        this.host = config.host;
        this.port = config.port;
        config.qq != undefined ? this.qq = config.qq:"";
        config.passwd != undefined ? this.passwd = config.passwd: "";

        fly.config.baseURL = "http://"+this.host+":"+this.port;

        this.once("init",async () => {
            this.about().then(async (r) => {
                this.auth_key(this.authKey).then(async (session) => {
                    if( session != null){
                        this.session = session;
                    } else {
                        throw {
                            code: "0010",
                            mag: "authKey 相关错误"
                        };
                    }

                    this.verify_session(this.session,this.qq).then(async (e) => {
                        if( e != 0){
                            return e;
                        }

                        this.once("wsinited",(ws: WebSocket) => {
                            this.wsMessage = ws;

                            this.GetInit = true;

                            this.emit("inited",this);
                        })

                        this.initMessage()
                    });
                });
            }).catch(err => {
                console.error(err);
            });
        })

        this.emit("init");

    }

    registCommand<M extends commandProcessor>(cp: M): Mirai {
        this.commandList.push(cp);

        return this;
    }

    execCommand(m: ImessageObject,message: messageChain){
        this.commandList.forEach((cp: commandProcessor) => {
            if(cp.getcase(0,this,m,message)){
                cp.exec(0,this,m,message);
            }
        })
    }

    

    /**
     * 尝试获得mirai服务器的基础信息
     * 使用此方法获取插件的信息，如版本号
     */
    async about(): Promise<object>{
        let e = await fly.get("/about");
        return e.data;
    }
    /**
     * 向mirai服务端验证authkey
     * 使用此方法验证你的身份，并返回一个会话
     */
    async auth_key(authKey: String): Promise<String>{
        let e = await fly.post("/auth",{
            "authKey": authKey
        })
        if(e.data.code == 0){
            return e.data.session;
        } else {
            return "";
        }
    }
    /**
     * 向服务器验证session
     * 使用此方法校验并激活你的Session，
     * 同时将Session与一个已登录的Bot绑定
     */
    async verify_session(session: String,qq: String): Promise<number>{
        let e = await fly.post("/verify",{
            "sessionKey": session,
            "qq": qq
        })

        return e.data.code;
    }
    /**
     * 释放session
     * 使用此方式释放session及其相关资源（Bot不会被释放）
     * 不使用的Session应当被释放，
     * 长时间（30分钟）未使用的Session将自动释放，
     * 否则Session持续保存Bot收到的消息，
     * 将会导致内存泄露(开启websocket后将不会自动释放)
     */
    async release_session(): Promise<number>{
        let e = await fly.post("/release",{
            "sessionKey": this.session,
            "qq": this.qq
        })

        return e.data.code;
    }
    /**
     * 在服务端执行一条指令
     * @template T
     * @param {String} command 要执行的指令
     * @param {Array} args 参数列表
     * @returns {Promise<T>} 返回值
     */
    async exec_command<T>(command: String,args: String[]): Promise<T>{
        let e = await fly.post("/command/send",{
            "authKey": this.authKey,
            "name": command,
            "args": args
        })

        return e.data;
    }
    /**
     * 使用此方法向指定好友发送消息
     */
    async sendFriendMessage(target: String,quote: Number,message: messageChain): Promise<Object>{
        let e = await fly.post("/sendFriendMessage",{
            "sessionKey": this.session,
            "target": target,
            "messageChain": message.getObj()
        })

        return e.data;
    }
    /**
     * 使用此方法向指定群发送消息
     */
    async sendGroupMessage(target: String,message: messageChain,quote?: Number,): Promise<Object>{
        console.log(message.getObj());
        let e = await fly.post("/sendGroupMessage",{
            "sessionKey": this.session,
            "target": target,
            "quote": quote,
            "messageChain": message.getObj()
        })

        return e.data;
    }
    /**
     * 使用此方法撤回指定消息。对于bot发送的消息，有2分钟时间限制。对于撤回群聊中群员的消息，需要有相应权限请求
     */
    async recallMessage(target: String): Promise<Object>{
        let e = await fly.post("/recall",{
            "target": target
        })

        return e.data;
    }
    /**
     * 初始化消息监听
     */
    async initMessage(): Promise<WebSocket> {
        const wsMessage = new WebSocket("ws://"+this.host+":"+this.port+"/message?sessionKey="+this.session,"",{});

        wsMessage.on("open",() => {
            this.emit("wsinited",wsMessage);

            console.log("websocket 链接成功");
        });

        wsMessage.on("message", (e) => {
            this.emit("message", <ImessageObject>JSON.parse(<string>e));
            this.on("message", (m: ImessageObject) => {
                let message = new messageChain().fromObj(m.messageChain ?? []);

                if(message.getStr()[0] == this.commandSymbol){
                    this.execCommand(m,message);
                }
            })
        })

        return wsMessage;
    }
}