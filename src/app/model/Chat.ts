import { ApiError } from './API';
import {
  AgoraEmojis,
  AgoraId,
  AgoraStartResponse,
  ParticipantPosition,
  UserName,
} from './Agora';
import { AgoraMemberInfo, AgoraMeta } from './AgoraMeta';
import { Message } from './Message';

export type ChatExitResponse = {
  userId: number;
  type: ParticipantPosition;
  socketDisconnectTime: string;
};

export type MemberId = AgoraMemberInfo['memberId'];

interface WebSocketChatMeta {
  type: 'META';
  data: AgoraMeta;
}

export interface WebSocketChatSend {
  type: 'CHAT';
  data: Message;
}

interface WebSocketChatReaction {
  type: 'REACTION';
  data: {
    chatId: Message['chatId'];
    reactionCount: AgoraEmojis;
  };
}

interface WebSocketChatStart {
  type: 'DISCUSSION_START';
  data: AgoraStartResponse;
}

export interface WebSocketChatUserKick {
  type: 'KICK';
  kickVoteInfo: {
    targetMemberId: MemberId;
    message: string;
    nickname: UserName;
  };
}

interface WebSocketChatEnd {
  type: 'DISCUSSION_END';
  data: {
    agoraId: AgoraId;
    endTime: string;
  };
}

export type WebSocketResponse =
  | WebSocketChatMeta
  | WebSocketChatReaction
  | WebSocketChatSend
  | WebSocketChatStart
  | WebSocketChatEnd
  | WebSocketChatUserKick;

export interface WebSocketErrorResponse extends ApiError {
  status: 'ERROR';
  timestamp: string;
  message: string;
}
