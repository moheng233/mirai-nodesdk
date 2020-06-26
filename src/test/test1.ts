// @ts-check

import MessageChain from "../messageChain";

import Mirai from "../Mirai";
import { ImessageObject } from "../messageObject";

async function main(){
    let ROBOT = new Mirai({
        authKey: "INITKEY40Yvy5Ef",
        qq: "3453563382",
        passwd: "momeng1055",
        host: "127.0.0.1",
        port: "8888"
    });

    // let message = await ROBOT.sendGroupMessage("790172839",0,new MessageChain().add_at("1523433122").add_plain("你妈的，为什么！"));

    ROBOT.once("inited", (ROBOT: Mirai) => {
        console.log(ROBOT.GetInit);
    })

    ROBOT.registCommand({
        title: "墨尘是不是傻逼",
        help: "回答墨尘是不是傻逼",
        exec: async (R: Mirai, M: ImessageObject, Mc: MessageChain):Promise<Boolean> => {
            let sendpid = M.sender?.id != undefined ? M.sender?.id: "" ;
            let sendgid = M.sender?.group?.id != undefined ? M.sender?.group?.id: "";
            
            let mid = Mc.getObj()[0].id;
            let mct = new MessageChain().add_plain("不是，墨恒是个傻逼");

            if(M.type === "FriendMessage") {

                await R.sendFriendMessage(sendpid, mct, mid);
            } else if(M.type === "GroupMessage") {
    
                await R.sendGroupMessage(sendgid, mct, mid);
            }

            return true;
        }
    });

    ROBOT.on("message",(m:ImessageObject) => {
        console.log(new MessageChain().fromObj(m.messageChain ?? []).getStr());
    })

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