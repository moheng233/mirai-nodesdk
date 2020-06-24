import fastjson from "fast-json-stringify";

export const messageDataStringify = fastjson({
    title: "type",
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "messageChain": {
            type: "array",
            items: {
                type: "object",
                properties: {
                    "type": {
                        type: "string"
                    },
                    "id": {
                        type: "string"
                    },
                    "time": {
                        type: "string"
                    },
                    "text": {
                        type: "string"
                    },
                    "target": {
                        type: "string"
                    }
                }
            }
        },
        "sender": {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "memberName": {
                    type: "string"
                },
                "permission": {
                    type: "string"
                },
                "group": {
                    type: "object",
                    properties: {
                        "id": {
                            type: "string"
                        },
                        "name": {
                            type: "string"
                        },
                        "permission": {
                            type: "string"
                        }
                    }
                }
            }
        }
    }
});