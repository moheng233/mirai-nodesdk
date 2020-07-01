import { ImessageObject, ImessageChain } from "./messageObject";

export function getArg(M: ImessageChain[]){
    return getStr(M).split(" ");
}

export function getStr(M: ImessageChain[]){
    let Str = "";

    M.forEach((e) => {
        switch (e.type) {
            case "Plain":
                Str += e.text;
                break;
            case "At":
                Str += e.target;
                break;
        }
    });

    return Str.trim();
}

export function getGid(M: ImessageObject){
    return M.sender?.group?.id != undefined ? M.sender?.group?.id: "";

}

export function getPid(M: ImessageObject){
    return M.sender?.id != undefined ? M.sender?.id: "" ;
}