import {commandProcessor} from "./commandProcessor";
import Mirai from "./Mirai";
import { ImessageObject } from "./messageObject";
import messageChain from "./messageChain";

export interface IregistCommands {
    commandList: commandProcessor[];

    /**
     * 注册一个指令
     * @param cn 注册的指令名
     * @param cp 注册的指令处理器
     */
    registCommand<M extends commandProcessor>(cp: M): Mirai;
    
    execCommand(m: ImessageObject,message: messageChain): void;
}