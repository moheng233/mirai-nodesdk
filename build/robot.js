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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.robot = void 0;
// @flow
var flyio_1 = __importDefault(require("flyio"));
// import WebSocket from "ws";
var ws_1 = __importDefault(require("ws"));
/**
 * @class 机器人的基础类
 */
var robot = /** @class */ (function () {
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
    function robot(config) {
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
    robot.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, session, e, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.about()];
                    case 1:
                        r = _b.sent();
                        return [4 /*yield*/, this.auth_key(this.authKey)];
                    case 2:
                        session = _b.sent();
                        if (session != null) {
                            this.session = session;
                        }
                        else {
                            return [2 /*return*/, {
                                    code: "0010",
                                    mag: "authKey 相关错误"
                                }];
                        }
                        return [4 /*yield*/, this.verify_session(this.session, this.qq)];
                    case 3:
                        e = _b.sent();
                        if (e != 0) {
                            return [2 /*return*/, e];
                        }
                        _a = this;
                        return [4 /*yield*/, this.initMessage()];
                    case 4:
                        _a.wsMessage = _b.sent();
                        this.GetInit = true;
                        return [2 /*return*/, {
                                "code": "0000"
                            }];
                }
            });
        });
    };
    /**
     * 尝试获得mirai服务器的基础信息
     * 使用此方法获取插件的信息，如版本号
     * @returns {Promise<Object>} data
     */
    robot.prototype.about = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flyio_1.default.get("/about")];
                    case 1:
                        e = _a.sent();
                        return [2 /*return*/, e.data];
                }
            });
        });
    };
    /**
     * 向mirai服务端验证authkey
     * 使用此方法验证你的身份，并返回一个会话
     * @template T
     * @param {String} authKey mirai的authKey
     * @returns {Promise<T>} mirai返回的session
     */
    robot.prototype.auth_key = function (authKey) {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flyio_1.default.post("/auth", {
                            "authKey": authKey
                        })];
                    case 1:
                        e = _a.sent();
                        if (e.data.code == 0) {
                            return [2 /*return*/, e.data.session];
                        }
                        else {
                            return [2 /*return*/, ""];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 向服务器验证session
     * 使用此方法校验并激活你的Session，
     * 同时将Session与一个已登录的Bot绑定
     * @param {String} session mirai的session
     * @param {String} qq 要登录机器人的QQ号
     * @returns {Promise<Number>} 错误代码
     */
    robot.prototype.verify_session = function (session, qq) {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flyio_1.default.post("/verify", {
                            "sessionKey": session,
                            "qq": qq
                        })];
                    case 1:
                        e = _a.sent();
                        return [2 /*return*/, e.data.code];
                }
            });
        });
    };
    /**
     * 释放session
     * 使用此方式释放session及其相关资源（Bot不会被释放）
     * 不使用的Session应当被释放，
     * 长时间（30分钟）未使用的Session将自动释放，
     * 否则Session持续保存Bot收到的消息，
     * 将会导致内存泄露(开启websocket后将不会自动释放)
     * @returns {Promise<Number>}
     */
    robot.prototype.release_session = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flyio_1.default.post("/release", {
                            "sessionKey": this.session,
                            "qq": this.qq
                        })];
                    case 1:
                        e = _a.sent();
                        return [2 /*return*/, e.data.code];
                }
            });
        });
    };
    /**
     * 在服务端执行一条指令
     * @template T
     * @param {String} command 要执行的指令
     * @param {Array} args 参数列表
     * @returns {Promise<T>} 返回值
     */
    robot.prototype.exec_command = function (command, args) {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flyio_1.default.post("/command/send", {
                            "authKey": this.authKey,
                            "name": command,
                            "args": args
                        })];
                    case 1:
                        e = _a.sent();
                        return [2 /*return*/, e.data];
                }
            });
        });
    };
    /**
     * 使用此方法向指定好友发送消息
     * @template T
     * @param {String} target 发送消息目标好友的QQ号
     * @param {Number} quote 引用一条消息的messageId进行回复
     * @param {messageChain} message 消息链，是一个消息对象构成的数组
     * @returns {Promise<T>}
     * @example {code: 0, msg: "success", messageId: 403286}
     */
    robot.prototype.sendFriendMessage = function (target, quote, message) {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flyio_1.default.post("/sendFriendMessage", {
                            "sessionKey": this.session,
                            "target": target,
                            "messageChain": message
                        })];
                    case 1:
                        e = _a.sent();
                        return [2 /*return*/, e.data];
                }
            });
        });
    };
    /**
     * 使用此方法向指定群发送消息
     * @param {String} target 发送消息目标好友的QQ号
     * @param {Number} quote 引用一条消息的messageId进行回复
     * @param {messageChain} message message 消息链，是一个消息对象构成的数组
     */
    robot.prototype.sendGroupMessage = function (target, quote, message) {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flyio_1.default.post("/sendGroupMessage", {
                            "sessionKey": this.session,
                            "target": target,
                            "messageChain": message
                        })];
                    case 1:
                        e = _a.sent();
                        return [2 /*return*/, e.data];
                }
            });
        });
    };
    /**
     * 使用此方法撤回指定消息。对于bot发送的消息，有2分钟时间限制。对于撤回群聊中群员的消息，需要有相应权限请求
     * @template T
     * @param {String} target 需要撤回的消息的messageId
     * @returns {Promise<T>}
     */
    robot.prototype.recallMessage = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flyio_1.default.post("/recall", {
                            "target": target
                        })];
                    case 1:
                        e = _a.sent();
                        return [2 /*return*/, e.data];
                }
            });
        });
    };
    /**
     * 监听机器人接受到的信息
     */
    robot.prototype.initMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wsMessage;
            return __generator(this, function (_a) {
                wsMessage = new ws_1.default("ws://" + this.host + ":" + this.port + "/message?sessionKey=" + this.session, "", {});
                wsMessage.on("open", function () {
                    console.log("websocket 链接成功");
                });
                return [2 /*return*/, wsMessage];
            });
        });
    };
    /**
     * @param {CallableFunction} fun
     */
    robot.prototype.bindMessage = function (fun) {
        this.wsMessage.on("message", function (m) {
            fun(m);
        });
    };
    return robot;
}());
exports.robot = robot;
