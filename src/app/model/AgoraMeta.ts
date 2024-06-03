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
  }
  participants: Participants[];
}
