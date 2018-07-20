export interface RoomMemberQueryFilter {
  name?         : string,
  roomAlias?    : string,
  contactAlias? : string,
}

export interface RoomQueryFilter {
  topic: string | RegExp,
}

export interface RoomPayload {
  id : string,

  topic        : string,
  avatar?      : string,
  memberIdList : string[],
  ownerId?     : string,
}

export interface RoomMemberPayload {
  id         : string
  roomAlias? : string,   // "李佳芮-群里设置的备注", `chatroom_nick_name`
  inviterId? : string,   // "wxid_7708837087612",
  avatar     : string,
  name       : string,
}

export type RoomPayloadFilterFunction = (payload: RoomPayload)    => boolean
export type RoomPayloadFilterFactory  = (query: RoomQueryFilter)  => RoomPayloadFilterFunction

export interface RoomInvitationResult {
  succeed: boolean,
  message: string
}

export interface RoomInvitation {
  roomName    : string,
  fromUser    : string,
  timestamp   : number,
  accept      : () => Promise<RoomInvitationResult>
}
