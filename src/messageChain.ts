interface Imessagechainarray {
    type: String,
    text?: String,
    target?: String
}


export default class MessageChain {

    message_chain: Array<Imessagechainarray> = [];

    /**
     * 一个消息链对象
     */
    constructor(){
    }

    fromJson(Json: string): MessageChain{
        this.message_chain = JSON.parse(Json).messageChain;

        return this;
    }
    fromObj(Obj: Array<Imessagechainarray>): MessageChain{
        this.message_chain = Obj;
        
        return this;
    }

    /**
     * 添加行文字
     * @param {String} text 要发送的文字
     * @returns {MessageChain}
     */
    add_plain(text: string): MessageChain{
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
    add_at(target: string): MessageChain{
        this.message_chain.push({
            "type": "At",
            "target": target
        });
        return this;
    }
    /**
     * 返回消息链的obj格式
     */
    getObj(){
        return this.message_chain;
    }

    /**
     * 返回消息链的Str格式
     * @returns {String}
     */
    getStr(): string{
        let Str = "";

        this.getObj().forEach((e: any) => {
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
    }
    /**
     * @returns {String[]}
     */
    getListStr(): string[]{
        return this.getStr().split(" ");
    }
}