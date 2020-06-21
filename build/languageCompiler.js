"use strict";
// @ts-check
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 语言处理器
 */
var languageCompiler = /** @class */ (function () {
    function languageCompiler() {
    }
    /**
     * 对于消息进行编译
     * @param {messageChain} message 接受的消息
     */
    languageCompiler.prototype.messageCompiler = function (message) {
        var text = "";
        message.getObj().forEach(function (element) {
            switch (element.type) {
                case "Plain":
                    text += element.text;
                    break;
                case "At":
                    text += element.target;
                    break;
            }
        });
        return text;
    };
    return languageCompiler;
}());
exports.default = languageCompiler;
