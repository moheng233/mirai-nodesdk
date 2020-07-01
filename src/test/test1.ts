import Mirai from "../Mirai";
import { ImessageObject } from "../messageObject";
import { getPid, getGid, getArg, getStr } from "../tool";

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
        title: "#禁言",
        help: "禁言某人",
        exec: async (R: Mirai, M: ImessageObject):Promise<Boolean> => {
            let arg = getArg(M.messageChain);
            let sendpid = getPid(M);
            let sendgid = getGid(M);
            
            let mid = M.messageChain[0].id;
        
            if(arg.length >= 2) {

            } 

            return true;
        }
    });

    ROBOT.on("message",(m:ImessageObject) => {
        console.log(getStr(m.messageChain));
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