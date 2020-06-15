const fly = require("flyio");
const messageChain = require("./messageChain");

/**
 * @class 机器人的基础类
 * @todo 有一个bug
 */
class robot {
    /**
     * @var {Boolean} 获取robot有没有正常初始化的变量
     */
    isInit = false;

    /**
     * 机器人的基础类
     * 所有的东西都在这里了
     * @param {Object} config  config设置对象
     * @param {String} config.authKey mirai的AuthKEY
     * @param {String} config.host mirai的主机地址
     * @param {String} config.port mirai的主机端口
     * @param {String} config.qq mirai的机器人qq
     * @param {String} config.passwd mirai的机器人密码,为0时不自动登陆,其他即自动登陆
     */
    constructor (config){
        this.authKey = config.authKey;
        this.host = config.host;
        this.port = config.port;
        this.qq = config.qq;
        this.passwd = config.passwd;
        fly.config.baseURL = "http://"+this.host+":"+this.port;

    }
    /**
     * 初始化，必须！
     */
    async init () {
        let r = await this.about();

        let session = await this.auth_key(this.authKey);
        if( session != false){
            this.session = session;
        } else {
            return {
                code: "0010",
                mag: "authKey 相关错误"
            };
        }

        // if( this.passwd != 0) {
        //     let e = await this.exec_command("login",[this.qq,this.passwd]);
        //     console.log(e);
        // }

        let e = await this.verify_session(this.session,this.qq);
        if( e != 0){
            return e;
        }
        this.GetInit = true;
        return 0;
    }
    /**
     * 尝试获得mirai服务器的基础信息
     * 使用此方法获取插件的信息，如版本号
     * @returns {Object} data
     */
    async about(){
        let e = await fly.get("/about");
        return e.data;
    }
    /**
     * 向mirai服务端验证authkey
     * 使用此方法验证你的身份，并返回一个会话
     * @param {String} authKey mirai的authKey
     * @returns {String} mirai返回的session
     */
    async auth_key(authKey){
        let e = await fly.post("/auth",{
            "authKey": authKey
        })
        if(e.data.code == 0){
            return e.data.session;
        } else {
            return false;
        }
    }
    /**
     * 向服务器验证session
     * 使用此方法校验并激活你的Session，
     * 同时将Session与一个已登录的Bot绑定
     * @param {String} session mirai的session
     * @param {String} qq 要登录机器人的QQ号
     * @returns {Int16Array} 错误代码
     */
    async verify_session(session,qq){
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
     * @returns {Int16Array}
     */
    async release_session(){
        let e = await fly.post("/release",{
            "sessionKey": this.session,
            "qq": this.qq
        })

        return e.data.code;
    }
    /**
     * 在服务端执行一条指令
     * @param {String} command 要执行的指令
     * @param {Array} arg 参数列表
     * @returns {String} 返回值
     */
    async exec_command(command,args){
        let e = await fly.post("/command/send",{
            "authKey": this.authKey,
            "name": command,
            "args": args
        })

        return e.data;
    }
    /**
     * 使用此方法向指定好友发送消息
     * @param {String} target 发送消息目标好友的QQ号
     * @param {Int} quote 引用一条消息的messageId进行回复
     * @param {messageChain} message 消息链，是一个消息对象构成的数组
     * @returns {Object}
     * @example {code: 0, msg: "success", messageId: 403286}
     */
    async sendFriendMessage(target,quote,message){
        let e = await fly.post("/sendFriendMessage",{
            "sessionKey": this.session,
            "target": target,
            "messageChain": message
        })

        return e.data;
    }
    /**
     * 使用此方法向指定群发送消息
     * @param {String} target 发送消息目标好友的QQ号
     * @param {Int} quote 引用一条消息的messageId进行回复
     * @param {messageChain} message message 消息链，是一个消息对象构成的数组
     */
    async sendGroupMessage(target,quote,message){
        let e = await fly.post("/sendGroupMessage",{
            "sessionKey": this.session,
            "target": target,
            "messageChain": message
        })

        return e.data;
    }
    /**
     * 使用此方法撤回指定消息。对于bot发送的消息，有2分钟时间限制。对于撤回群聊中群员的消息，需要有相应权限请求
     * @param {String} target 需要撤回的消息的messageId
     * @returns {Object}
     */
    async recallMessage(target){
        let e = await fly.post("/recall",{
            "target": target
        })

        return e.data;
    }
}

module.exports = robot;