// @ts-check
const messageChain = require("../src/messageChain");

async function main(){
    /**
     * @type {import("../src/messageChain")}
     */
    let m = new messageChain()
        .add_plain("#禁言 ")
        .add_at("1523433122")


    console.log(m.getStr());
    console.log(m.getListStr());
}

main();