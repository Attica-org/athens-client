import { AGORA_STATUS } from '@/constants/agora';

export type Status = (typeof AGORA_STATUS)[keyof typeof AGORA_STATUS];

export interface Agora {
  id: number;
  agoraTitle: string;
  agoraColor: string;
  participants: {
    pros: number;
    cons: number;
    observer: number;
  };
  imageUrl: string;
  createdAt?: string;
  status: Status;
}

export interface ClosedAgora {
  id: number;
  agoraTitle: string;
  agoraColor: string;
  imageUrl: string;
  prosCount: number;
  consCount: number;
  totalMember: number;
  createdAt: string;
  status: Status | '';
}

export type AgoraData = Agora | ClosedAgora;

export interface AgoraBasicFacts {
  title: string;
  status: Status;
}

export interface AgoraUserProfileType {
  id: number;
  nickname: string;
  photoNumber: number;
  type: ParticipationPosition;
}

export interface AgoraSideBarDataType {
  agoraId: number;
  agoraThumbnailUrl: string | null;
  participants: AgoraUserProfileType[];
}

export type ParticipantCountAction = 'DECREASE' | 'INCREASE';

export interface SearchParams {
  status?: string;
  category?: string;
  q?: string;
}

interface ColorType {
  idx: number;
  value: string;
}

export interface ImageData {
  dataUrl: string;
  file: File;
}

export type AgoraConfig = {
  title: string;
  thumbnail: string;
  category: string;
  color: ColorType;
  capacity: number;
  duration: number | null;
};

export type ParticipationPosition = 'PROS' | 'CONS' | 'OBSERVER';
export type VotePosition = 'PROS' | 'CONS' | 'DEFAULT';
export type ProsPos = 'PROS';
export type ConsPos = 'CONS';
export type ObserverPos = 'OBSERVER';

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

export type KickVoteResponse = {
  type: string;
  kickVoteInfo: {
    targetMemberId: number;
    message: string;
  };
};
