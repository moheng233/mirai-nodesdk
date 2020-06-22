// @ts-check

const { default: MessageChain } = require("../build/messageChain");

const robot = require("../build/robot").default;
const messageChain = require("../build/messageChain").default;

async function main(){
    let ROBOT = new robot({
        authKey: "INITKEYqqfY9eVF",
        qq: "3453563382",
        passwd: "momeng1055",
        host: "127.0.0.1",
        port: "8888"
    });

    console.log(await ROBOT.init());

    let message = await ROBOT.sendGroupMessage("790172839",0,new messageChain().add_at("1523433122").add_plain("你妈的，为什么！"));
    // await ROBOT.recallMessage(message.messageId);

    ROBOT.bindMessage(async (e) => {
        // @ts-ignore
        console.log(new MessageChain().fromJson(e).getStr());
        console.log(e);
        // @ts-ignore
        let eo = JSON.parse(e);
        // @ts-ignore
        if(new MessageChain().fromJson(e).getStr() == "#你妈的") {
            await ROBOT.sendGroupMessage(eo["sender"]["group"]["id"],0,new messageChain().add_at(eo["sender"]["id"]).add_plain("你妈的！"));
        }
    });

    console.log(await ROBOT.release_session());
}

main()
    .catch((err) => {
    console.error(err);
});