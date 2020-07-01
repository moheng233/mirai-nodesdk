import Mirai from "./Mirai";
import { ImessageObject } from "./messageObject";

export interface IregistCommands {
    commandList: ICommand[];

    /**
     * 注册一个指令
     * @param cn 注册的指令名
     * @param cp 注册的指令处理器
     */
    registCommand(cp: ICommand): Mirai;
    
    execCommand(m: ImessageObject): void;
}

export interface ICommand {
    /**
     * 指令的触发条件，不带#
     */
    title: String,
    /**
     * 指令的帮助
     */
    help: String,
    exec: (R: Mirai,M: ImessageObject) => Promise<Boolean>,
}