const messageChain = require("../build/messageChain");

async function main(){

    let m = new messageChain()
        .add_plain("#禁言 ")
        .add_at("1523433122")


    console.log(m.getStr());
    console.log(m.getListStr());
}

main();