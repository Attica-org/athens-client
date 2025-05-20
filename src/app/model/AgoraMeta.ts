import { AgoraId, AgoraTitle, ParticipantPosition } from './Agora';

type Participants = {
  type: ParticipantPosition;
  count: number;
};

type AgoraMemberInfo = {
  agoraId: number;
  memberId: number;
  username: string;
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
