"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageChain = /** @class */ (function () {
    /**
     * 一个消息链对象
     */
    function MessageChain() {
        this.message_chain = [];
    }
    /**
     * 添加行文字
     * @param {String} text 要发送的文字
     * @returns {MessageChain}
     */
    MessageChain.prototype.add_plain = function (text) {
        this.message_chain.push({
            "type": "Plain",
            "text": text
        });
        return this;
    };
    /**
     * At一个人
     * @param {String} target 要At人的QQ号
     * @returns {MessageChain}
     */
    MessageChain.prototype.add_at = function (target) {
        this.message_chain.push({
            "type": "At",
            "target": target
        });
        return this;
    };
    /**
     * 返回消息链的obj格式
     */
    MessageChain.prototype.getObj = function () {
        return this.message_chain;
    };
    /**
     * 返回消息链的Str格式
     * @returns {String}
     */
    MessageChain.prototype.getStr = function () {
        var Str = "";
        this.getObj().forEach(function (e) {
            // @ts-ignore
            switch (e.type) {
                case "Plain":
                    Str += e.text;
                    break;
                case "At":
                    Str += e.target;
                    break;
            }
        });
        return Str;
    };
    /**
     * @returns {String[]}
     */
    MessageChain.prototype.getListStr = function () {
        return this.getStr().split(" ");
    };
    return MessageChain;
}());
exports.default = MessageChain;
