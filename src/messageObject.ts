
export interface ImessageObject {
    "type": "GroupMessage" | "FriendMessage" | "TempMessage" | "Auto" ,
        
    "messageChain": ImessageChain[],
    "sender": {
        "id": String,
        "memberName": String,
        "permission": "OWNER" | "ADMINISTRATOR" | "MEMBER",
        "group"?: {
            "id": String,
            "name": String,
            "permission": "OWNER" | "ADMINISTRATOR" | "MEMBER"
        }
    }
}

export interface IEventObject {
    "type": "BotOnlineEvent" | "BotOfflineEventForce" | "BotOfflineEventDropped" | "BotReloginEvent" |
    "GroupRecallEvent" | "FriendRecallEvent" |
    "BotGroupPermissionChangeEvent" | "BotMuteEvent" | "BotUnmuteEvent" | "GroupMuteAllEvent" |
    "BotJoinGroupEvent" | "BotLeaveEventActive" | "BotLeaveEventKick" |
    "GroupNameChangeEvent" | "GroupEntranceAnnouncementChangeEvent" |
    "GroupAllowAnonymousChatEvent" | "GroupAllowConfessTalkEvent" |
    "GroupAllowMemberInviteEvent" | "MemberJoinEvent" |
    "MemberLeaveEventKick" | "MemberLeaveEventQuit" | "MemberCardChangeEvent" |
    "MemberSpecialTitleChangeEvent" | "MemberPermissionChangeEvent" | "MemberMuteEvent" | "MemberUnmuteEvent" |
    "NewFriendRequestEvent" | "MemberJoinRequestEvent" | "BotInvitedJoinGroupRequestEvent",
    "eventId"?: String,
    "fromId"?: String,
    "groupId"?: String,
    "groupName"?: String,
    "nick"?: String,
    "message"?: String,
    "qq"?: String,
    "authorId"?: String,
    "messageId"?: String,
    "time"?: String,
    "operator"?: String | {
        "id": String,
        "memberName": String,
        "permission": "OWNER" | "ADMINISTRATOR" | "MEMBER",
        "group": {
            "id": String,
            "name": String,
            "permission": "OWNER" | "ADMINISTRATOR" | "MEMBER"
        }
    },
    "group"?: {
        "id": String,
        "name": String,
        "permission": "OWNER" | "ADMINISTRATOR" | "MEMBER"
    },
    "origin"?: "OWNER" | "ADMINISTRATOR" | "MEMBER" | String | Boolean,
    "new"?: "OWNER" | "ADMINISTRATOR" | "MEMBER" | String | Boolean,
    "current"?: "OWNER" | "ADMINISTRATOR" | "MEMBER" | String | Boolean,
    "member"?: {
        "id": String,
        "memberName": String,
        "permission": "OWNER" | "ADMINISTRATOR" | "MEMBER",
        "group": {
            "id": String,
            "name": String,
            "permission": "OWNER" | "ADMINISTRATOR" | "MEMBER"
        }
    },
    "isByBot"?: Boolean,
    "durationSeconds"?: String,

}

export interface ImessageChain {
    "type": "Source" | "Quote" | "Face" | "Image" | "FlashImage" | "Plain" | "At" | "AtAll" | String,
    "text"?: String,
    "id"?: String,
    "time"?: String,
    "target"?: String,
    "display"?: String,
    "groupId"?: String,
    "senderId"?: String,
    "targetId"?: String,
    "faceId"?: String,
    "name"?: String,
    "imageId"?: String,  //群图片格式
    "url"?: String,
    "path"?: String,
    "origin"?: ImessageChain[]
}

export interface IGroud {
    "id": String,
    "name": String,
    "permission": "OWNER" | "ADMINISTRATOR" | "MEMBER"
}

export interface IGroudP {
    "id": String,
    "memberName": String,
    "permission":"OWNER" | "ADMINISTRATOR" | "MEMBER",
    "group": IGroud
}

export interface IFirend {
    "id": String,
    "nickname": String,
    "remark": String
}