type Status = 'RUNNING' | 'CLOSED' | 'QUEUED';

export interface Agora {
  id: number;
  agoraTitle: string;
  agoraColor: string;
  participants: {
    pros: number;
    cons: number;
    observer: number;
  };
  createdAt?: string;
  status: Status;
}

export interface ClosedAgora {
  id: number;
  agoraTitle: string;
  agoraColor: string;
  prosCount: number;
  consCount: number;
  createdAt: string;
  status: string;
}

export type AgoraData = Agora | ClosedAgora;
