// @flow
import fly from "flyio";
// import WebSocket from "ws";
import WebSocket from "ws";
import { EventEmitter } from "events";
import { ImessageObject, ImessageChain, IGroud, IFirend, IGroudP } from "./messageObject";
import { IregistCommands, ICommand } from "./registCommands";
import Message from "./Message";
import { getPid, getGid, getArg, getStr } from "./tool";

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
    commandSymbol = "#";
    GetInit= false;
    wsMessage!: WebSocket;

    commandList: ICommand[] = [];


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

        this.on("inited",(ROBOT: Mirai) => {
            this.on("message", (M: ImessageObject) => {
                let message = M.messageChain;
    
                if(getStr(message)[0] == this.commandSymbol){
                    this.execCommand(M);
                }
            })


            ROBOT.registCommand({
                title: "帮助",
                help: "输出指令的帮助 #帮助 [command]",
                exec: async function (R: Mirai,M: ImessageObject): Promise<Boolean>{
                    let str = "\n";
                    let arg = getArg(M.messageChain);

                    if(arg.length === 2){
                        for (let e of R.commandList) {
                            if(e.title === arg[1]){
                                str += `#${e.title}\n  ${e.help} \n`;

                                break;
                            }
                        }
                    } else {
                        R.commandList.forEach(e => {
                            str += `#${e.title}  ${e.help} \n`;
                        });
                    }
                    
                    let sendpid = getPid(M);
                    let sendgid = getGid(M);
                    
                    let mid = M.messageChain[0].id ?? "";

                    new Message(R)
                        .type(M.type)
                        .target(sendgid === "" ? sendpid: sendgid)
                        .add("Plain",str)
                        .quote(mid)
                        .send()
                    
                    return true;
                }
            })
        });

        this.emit("init");

    }

    on(event: "init", listener: () => void): this;
    on(event: "inited", listener: (ROBOT: Mirai) => void): this;
    on(event: "wsinited", listener: (ws: WebSocket) => void): this;
    on(event: "message", listener: (m:ImessageObject) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void){
        return super.on(event,listener);
    }

    emit(event: "init"): boolean;
    emit(event: "inited", ROBOT: Mirai): boolean;
    emit(event: "wsinited", ws: WebSocket): boolean;
    emit(event: "message", m:ImessageObject): boolean;
    emit(event: string | symbol, ...args: any[]): boolean{
        return super.emit(event, ...args);
    }

    registCommand(cp: ICommand): Mirai {
        this.commandList.push(cp);

        return this;
    }

    execCommand(M: ImessageObject){
        for (const e of this.commandList) {
            if((this.commandSymbol + e.title) === getArg(M.messageChain)[0]){
                e.exec(this,M).catch((err) => {
                    console.error(err);
                });

                break;
            }
        }
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
     * 三个函数的包装函数
     * @param type 发送消息的类型
     * @param target 发送的目标
     * @param message 要发送的消息链
     * @param quote 回复
     */
    async sendMessage(type: "FriendMessage" | "GroupMessage" | "TempMessage" | "Auto", target: String, message: ImessageChain[], quote?: String){
        if(type === "FriendMessage") {

            await this.sendFriendMessage(target, message, quote);
        } else if(type === "GroupMessage") {

            await this.sendGroupMessage(target, message, quote);
        }
    }


    
    /**
     * 给你亲爱的好友发一条消息
     * @param target 要发送的好友QQ号
     * @param message 要发送的消息链
     * @param quote 要回复的消息
     */
    async sendFriendMessage(target: String,message: ImessageChain[],quote?: String): Promise<Object>{
        let o:any = {
            "sessionKey": this.session,
            "target": target,
            "messageChain": message
        }

        if(quote != undefined){
            o["quote"] = quote;
        }

        let e = await fly.post("/sendFriendMessage",o)

        return e.data;
    }
    
    /**
     * 在你亲爱的QQ群中发一条消息
     * @param target 要发送的QQ群号
     * @param message 要发送的消息
     * @param quote 要回复的消息
     */
    async sendGroupMessage(target: String,message: ImessageChain[],quote?: String,): Promise<Object>{
        let o:any = {
            "sessionKey": this.session,
            "target": target,
            "messageChain": message
        }

        if(quote != undefined){
            o["quote"] = quote;
        }

        let e = await fly.post("/sendGroupMessage",o)

        return e.data;
    }

    /**
     * 使用此方法撤回指定消息。对于bot发送的消息，有2分钟时间限制。对于撤回群聊中群员的消息，需要有相应权限请求
     */
    async recallMessage(target: String): Promise<Object>{
        let e = await fly.post("/recall",{
            "sessionKey": this.session,
            "target": target
        })

        return e.data;
    }

    /**
     * 禁言！
     * @param gid 要禁言的qq群
     * @param pid 要禁言的人
     * @param time 要禁言的时间 单位是s
     */
    async Mute(gid: String,pid: String,time: Number): Promise<{code: String,msg: String}>{
        let e = await fly.post("/mute", {
            "sessionKey": this.session,
            "target": gid,
            "memberId": pid,
            "time": time
        })

        return e.data;
    }

    async unMute(gid: String,pid: String): Promise<{code: String,msg: String}>{
        let e = await fly.post("/unmute", {
            "sessionKey": this.session,
            "target": gid,
            "memberId": pid
        })

        return e.data;
    }

    /**
     * 我tm全体禁言!
     * @param target 要禁言的群
     */
    async allMute(target: String): Promise<{code: String,msg: String}>{
        let e = await fly.post("/muteAll",{
            "sessionKey": this.session,
            "target": target
        })

        return e.data;
    }

    /**
     * 我tm解除禁言！
     * @param target 要解除禁言的群
     */
    async unallMute(target: String): Promise<{code: String,msg: String}>{
        let e = await fly.post("/unmuteAll",{
            "sessionKey": this.session,
            "target": target
        })

        return e.data;
    }

    async getGroudList(): Promise<IGroud[]>{
        let e = await fly.get("/groupList",{
            "sessionKey": this.session
        })

        return e.data;
    }

    async getGroudPList(gid: String): Promise<IGroudP[]>{
        let e = await fly.get("/memberList", {
            "sessionKey": this.session,
            "target": gid
        })

        return e.data;
    }

    async getFirendList(): Promise<IFirend[]>{
        let e = await fly.get("/friendList", {
            "sessionKey": this.session
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

            console.log("websocket 链接成功!");
        });

        wsMessage.on("message", (e) => {
            this.emit("message", <ImessageObject>JSON.parse(<string>e));
        })

        return wsMessage;
    }
}