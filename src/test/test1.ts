// @ts-check

import MessageChain from "../messageChain";

import robot from "../robot";
import robotEvent from "../robotEvent";

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

    robotEvent.object.on("message",async (m) => {
        console.log(JSON.stringify(m));
        let message = new MessageChain().fromObj(m.messageChain);

        if(message.getStr() == "#你妈的") {
            ROBOT.sendGroupMessage(m["sender"]["group"]["id"],0,new MessageChain().add_at(m["sender"]["id"]).add_plain("你妈的，为什么！"))
                .catch((e: any) => {
                    console.error(e);
                })
                .then((e: any) => {
                    console.log(e);
                });
        }

    });

    process.on("SIGINT", async ()=> {
        console.log(await ROBOT.release_session());

        process.exit(0);
    })

    return ROBOT;
}

main()
    .then((ROBOT) => {
        // console.log(ROBOT.release_session());
    })
    .catch((err) => {
    console.error(err);
});