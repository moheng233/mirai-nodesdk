// @ts-check

import MessageChain from "../messageChain";

import robot from "../robot";
import robotEvent from "../robotEvent";
import commandProcessor from "../commandGroud";

async function main(){
    let ROBOT = new robot({
        authKey: "INITKEYT0h5dLxX",
        qq: "3453563382",
        passwd: "momeng1055",
        host: "127.0.0.1",
        port: "8888"
    });

    console.log(await ROBOT.init());

    // let message = await ROBOT.sendGroupMessage("790172839",0,new MessageChain().add_at("1523433122").add_plain("你妈的，为什么！"));

    let NIMADE = new nimade();

    process.on("SIGINT", async ()=> {
        console.log(await ROBOT.release_session());

        process.exit(0);
    })

    return ROBOT;
}

class nimade extends commandProcessor {
    constructor(){
        super();

        this.title = "你妈的";

        this.groundList.push({
            title: "help",
            fun: async (ROBOT,m,message) => {
                ROBOT.sendGroupMessage(<string>m["sender"]["group"]["id"],0,new MessageChain().add_plain("233"))
            }
        })
    }
}

main()
    .then((ROBOT) => {
        // console.log(ROBOT.release_session());
    })
    .catch((err) => {
    console.error(err);
});