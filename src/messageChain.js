// @ts-check

class MessageChain {

    /** 
     * @type {{ type: string; text?: string; target?: string; }[]} 
     */
    message_chain;

    /**
     * 一个消息链对象
     */
    constructor(){
        this.message_chain = [];
    }
    /**
     * 添加行文字
     * @param {String} text 要发送的文字
     * @returns {MessageChain}
     */
    add_plain(text){
        this.message_chain.push({
            "type": "Plain",
            "text": text
        });
        return this;
    }
    /**
     * At一个人
     * @param {String} target 要At人的QQ号
     * @returns {MessageChain}
     */
    add_at(target){
        this.message_chain.push({
            "type": "At",
            "target": target
        });
        return this;
    }
    /**
     * 返回消息链的obj格式
     * @returns {Object}
     */
    getobj(){
        return this.message_chain;
    }
}

export default MessageChain;