import messageChain from "./messageChain";
import Mirai from "./Mirai";
import { ImessageObject } from "./messageObject";


/**
 * 指令处理器的父类型
 */

export class commandProcessor {
    title: String = "";

    constructor(){

    }

    getcase!: (offset: number, ROBOT: Mirai, m: ImessageObject, message: messageChain) => Boolean;

    arg!: (offset: number,ROBOT: Mirai,m: ImessageObject,message: messageChain) => String[];

    exec!:(offset: number,ROBOT: Mirai,m: ImessageObject,message: messageChain) => String;

    help!: (offset: number,ROBOT: Mirai,m: ImessageObject,message: messageChain) => String;
}