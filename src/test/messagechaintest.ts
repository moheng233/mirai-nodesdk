import MessageChain from "../messageChain";

async function main(){

    let m = new MessageChain()
        .add_plain("#禁言 ")
        .add_at("1523433122");


    console.log(m.getStr());
    console.log(m.getArgStr());
}

main();