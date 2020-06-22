"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @flow
const flyio_1 = __importDefault(require("flyio"));
// import WebSocket from "ws";
const ws_1 = __importDefault(require("ws"));
/**
 * @class 机器人的基础类
 */
class robot {
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
    constructor(config) {
        /** @type {String} */
        this.authKey = "";
        /** @type {String} */
        this.host = "";
        /** @type {String} */
        this.port = "";
        /** @type {String} */
        this.qq = "";
        /** @type {String} */
        this.passwd = "";
        /** @type {String} */
        this.session = "";
        this.GetInit = false;
        this.authKey = config.authKey;
        this.host = config.host;
        this.port = config.port;
        this.qq = config.qq;
        this.passwd = config.passwd;
        flyio_1.default.config.baseURL = "http://" + this.host + ":" + this.port;
    }
    /**
     * 初始化，必须！
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let r = yield this.about();
            let session = yield this.auth_key(this.authKey);
            if (session != null) {
                this.session = session;
            }
            else {
                return {
                    code: "0010",
                    mag: "authKey 相关错误"
                };
            }
            // if( this.passwd != 0) {
            //     let e = await this.exec_command("login",[this.qq,this.passwd]);
            //     console.log(e);
            // }
            let e = yield this.verify_session(this.session, this.qq);
            if (e != 0) {
                return e;
            }
            this.wsMessage = yield this.initMessage();
            this.GetInit = true;
            return {
                "code": "0000"
            };
        });
    }
    /**
     * 尝试获得mirai服务器的基础信息
     * 使用此方法获取插件的信息，如版本号
     * @returns {Promise<Object>} data
     */
    about() {
        return __awaiter(this, void 0, void 0, function* () {
            let e = yield flyio_1.default.get("/about");
            return e.data;
        });
    }
    /**
     * 向mirai服务端验证authkey
     * 使用此方法验证你的身份，并返回一个会话
     * @template T
     * @param {String} authKey mirai的authKey
     * @returns {Promise<T>} mirai返回的session
     */
    auth_key(authKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let e = yield flyio_1.default.post("/auth", {
                "authKey": authKey
            });
            if (e.data.code == 0) {
                return e.data.session;
            }
            else {
                return "";
            }
        });
    }
    /**
     * 向服务器验证session
     * 使用此方法校验并激活你的Session，
     * 同时将Session与一个已登录的Bot绑定
     * @param {String} session mirai的session
     * @param {String} qq 要登录机器人的QQ号
     * @returns {Promise<Number>} 错误代码
     */
    verify_session(session, qq) {
        return __awaiter(this, void 0, void 0, function* () {
            let e = yield flyio_1.default.post("/verify", {
                "sessionKey": session,
                "qq": qq
            });
            return e.data.code;
        });
    }
    /**
     * 释放session
     * 使用此方式释放session及其相关资源（Bot不会被释放）
     * 不使用的Session应当被释放，
     * 长时间（30分钟）未使用的Session将自动释放，
     * 否则Session持续保存Bot收到的消息，
     * 将会导致内存泄露(开启websocket后将不会自动释放)
     * @returns {Promise<Number>}
     */
    release_session() {
        return __awaiter(this, void 0, void 0, function* () {
            let e = yield flyio_1.default.post("/release", {
                "sessionKey": this.session,
                "qq": this.qq
            });
            return e.data.code;
        });
    }
    /**
     * 在服务端执行一条指令
     * @template T
     * @param {String} command 要执行的指令
     * @param {Array} args 参数列表
     * @returns {Promise<T>} 返回值
     */
    exec_command(command, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let e = yield flyio_1.default.post("/command/send", {
                "authKey": this.authKey,
                "name": command,
                "args": args
            });
            return e.data;
        });
    }
    /**
     * 使用此方法向指定好友发送消息
     * @template T
     * @param {String} target 发送消息目标好友的QQ号
     * @param {Number} quote 引用一条消息的messageId进行回复
     * @param {messageChain} message 消息链，是一个消息对象构成的数组
     * @returns {Promise<T>}
     * @example {code: 0, msg: "success", messageId: 403286}
     */
    sendFriendMessage(target, quote, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let e = yield flyio_1.default.post("/sendFriendMessage", {
                "sessionKey": this.session,
                "target": target,
                "messageChain": message.getObj()
            });
            return e.data;
        });
    }
    /**
     * 使用此方法向指定群发送消息
     * @param {String} target 发送消息目标好友的QQ号
     * @param {Number} quote 引用一条消息的messageId进行回复
     * @param {messageChain} message message 消息链，是一个消息对象构成的数组
     */
    sendGroupMessage(target, quote, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(message.getObj());
            let e = yield flyio_1.default.post("/sendGroupMessage", {
                "sessionKey": this.session,
                "target": target,
                "messageChain": message.getObj()
            });
            return e.data;
        });
    }
    /**
     * 使用此方法撤回指定消息。对于bot发送的消息，有2分钟时间限制。对于撤回群聊中群员的消息，需要有相应权限请求
     * @template T
     * @param {String} target 需要撤回的消息的messageId
     * @returns {Promise<T>}
     */
    recallMessage(target) {
        return __awaiter(this, void 0, void 0, function* () {
            let e = yield flyio_1.default.post("/recall", {
                "target": target
            });
            return e.data;
        });
    }
    /**
     * 初始化消息监听
     */
    initMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const wsMessage = new ws_1.default("ws://" + this.host + ":" + this.port + "/message?sessionKey=" + this.session, "", {});
            wsMessage.on("open", () => {
                console.log("websocket 链接成功");
            });
            return wsMessage;
        });
    }
    /**
     * @param {CallableFunction} fun
     */
    bindMessage(fun) {
        this.wsMessage.on("message", (m) => {
            fun(m);
        });
    }
}
exports.default = robot;
