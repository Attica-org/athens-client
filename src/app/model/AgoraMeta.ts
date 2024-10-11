type Participants = {
  type: string;
  count: number;
};

export interface AgoraMeta {
  agora: {
    id: number;
    title: string;
    createdAt: string;
    duration: number;
    startAt: string;
  };
  participants: Participants[];
  agoraMemberInfo: {
    agoraId: number;
    memberId: number;
    username: string;
    socketDisconnectTime: string;
  };
}
