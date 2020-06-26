import Mirai from "./Mirai";
import { ImessageObject } from "./messageObject";
import messageChain from "./messageChain";

export interface IregistCommands {
    commandList: ICommand[];

    /**
     * 注册一个指令
     * @param cn 注册的指令名
     * @param cp 注册的指令处理器
     */
    registCommand(cp: ICommand): Mirai;
    
    execCommand(m: ImessageObject,message: messageChain): void;
}

export interface ICommand {
    title: String,
    help: String,
    exec: (R: Mirai,M: ImessageObject,Mc: messageChain) => Promise<Boolean>,
}