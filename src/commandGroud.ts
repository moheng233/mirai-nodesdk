import messageChain from "./messageChain";
import robot from "./robot";
import robotEvent from "./robotEvent";

interface groundlist {
    title: String,
    fun: (ROBOT: robot,m: any,message: messageChain) => Promise<void>
}

/**
 * 指令处理器的父类型
 */

export default class commandProcessor {
    title: String = "";
    type: String = "groud"

    groundList: groundlist[] = [];

    constructor(){

        robotEvent.object.on("command", async (ROBOT: robot,m: Object,message: messageChain) => {
            if("#" + this.title == message.getListStr()[0])
            await this.run(ROBOT,m,message);
        })
    }

    async run(ROBOT: robot,m: Object,message: messageChain){
        let ms = message.getListStr();

        this.groundList.forEach(async (v,i) => {
            if(v.title == ms[1]) {
                v.fun(ROBOT,m,new messageChain);
            }
        })
    }
}