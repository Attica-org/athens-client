import { AgoraId, AgoraTitle, ParticipantPosition, UserName } from './Agora';

export type Participants = {
  type: ParticipantPosition;
  count: number;
};

export type AgoraMemberInfo = {
  agoraId: AgoraId;
  memberId: number;
  username: UserName;
  socketDisconnectTime: string;
};

export interface AgoraMeta {
  agora: {
    id: AgoraId;
    title: AgoraTitle;
    createdAt: string;
    duration: number;
    startAt: string;
  };
  participants: Participants[];
  agoraMemberInfo: AgoraMemberInfo;
}
