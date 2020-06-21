// @ts-check

import messageChain from "./messageChain";

/**
 * 语言处理器
 */
export default class languageCompiler {
    constructor(){

    }

    /**
     * 对于消息进行编译
     * @param {messageChain} message 接受的消息
     */
    messageCompiler(message){
        let text = "";

        message.getobj().forEach(element => {
            switch (element.type){
                case "Plain": 
                    text += element.text;
                    break;
                case "At":
                    text += element.target;
                    break;
            }

        });

        return text;
    }
}