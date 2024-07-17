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
  status: string;
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
  type: 'PROS' | 'CONS' | 'OBSERVER';
}

export type ParticipantCountAction = 'DECREASE' | 'INCREASE';

export interface SearchParams {
  status?: string;
  category?: string;
  q?: string;
}
