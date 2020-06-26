import Mirai from "./Mirai";
import { ImessageChain, ImessageObject } from "./messageObject";

export default class Message {
    private _MiraiI: Mirai;
    private _type: "GroupMessage" | "FriendMessage" | "TempMessage" | "Auto" = "Auto";
    private _target?: String;
    private _quote?: String;
    private _sender: { pid: String, pname: String, pp: "OWNER" | "ADMINISTRATOR" | "MEMBER", gid?: String, gname?: String, gp?: "OWNER" | "ADMINISTRATOR" | "MEMBER"} | undefined;
    private _mclist: ImessageChain[] = [];

    constructor(mI: Mirai, from?: ImessageObject) {
        this._MiraiI = mI;

        if (from != undefined) {
            this.type(from.type);
        }
    }

    type(): "GroupMessage" | "FriendMessage" | "TempMessage" | "Auto";
    type(t: "GroupMessage" | "FriendMessage" | "TempMessage" | "Auto"): this;
    type(t?: "GroupMessage" | "FriendMessage" | "TempMessage" | "Auto") {
        if (t == undefined) {
            return this._type;
        } else {
            this._type = t;
        }

        return this;
    }

    target(): String;
    target(t: String): this;
    target(t?: String) {
        if (t == undefined) {
            return this._target;
        } else {
            this._target = t;
        }

        return this;
    }

    quote(t?: String) {
        if (t == undefined) {
            return this._quote;
        } else {
            this._quote = t;
        }

        return this;
    }

    send() {

    }

}