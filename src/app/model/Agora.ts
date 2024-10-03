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

export interface AgoraUserProfileType {
  id: number;
  nickname: string;
  photoNumber: number;
  type: ParticipationPosition;
}

export type ParticipantCountAction = 'DECREASE' | 'INCREASE';

export interface SearchParams {
  status?: string;
  category?: string;
  q?: string;
}

export type AgoraConfig = {
  title: string;
  category: string;
  color: string;
  capacity: number;
  duration: number | null;
};

export type ParticipationPosition = 'PROS' | 'CONS' | 'OBSERVER';

export type ProfileImage = {
  id: number;
  name: string;
  file: string;
};

export type AgoraEmojis = {
  LIKE: number;
  DISLIKE: number;
  LOVE: number;
  HAPPY: number;
  SAD: number;
};
