import { AGORA_STATUS } from '@/constants/agora';

export type ParticipantPosition = 'PROS' | 'CONS' | 'OBSERVER';
export type VotePosition = 'PROS' | 'CONS' | 'DEFAULT';
export type ObserverPos = 'OBSERVER';
export type ActiveAgora = CategoryAgora | KeywordAgora;
export type UnionAgora = ActiveAgora | ClosedAgora;
export type Status = (typeof AGORA_STATUS)[keyof typeof AGORA_STATUS];
export type ImageURL = string | null;
export type AgoraId = number;
export type AgoraTitle = string;

export type Participants = {
  pros: number;
  cons: number;
  observer: number;
};

interface Agora {
  id: AgoraId;
  agoraTitle: AgoraTitle;
  agoraColor: string;
  imageUrl: ImageURL;
  status: Status;
}

export interface CategoryAgora extends Agora {
  participants: Participants;
}

export interface KeywordAgora extends Agora {
  participants: Participants;
  createdAt: string;
}

export interface ClosedAgora extends Agora {
  prosCount: number;
  consCount: number;
  totalMember: number;
  createdAt: string;
}

export interface AgoraBasicFacts {
  title: string;
  status: Status;
}

export interface AgoraUserProfileType {
  id: number;
  nickname: string;
  photoNumber: number;
  type: ParticipantPosition;
}

export interface AgoraSideBarDataType {
  agoraId: AgoraId;
  agoraThumbnailUrl: string | null; // server
  participants: AgoraUserProfileType[];
}

export enum ParticipantCountAction {
  DECREASE = 'DECREASE',
  INCREASE = 'INCREASE',
}

export interface SearchParams {
  status?: string;
  category?: string;
  q?: string;
}

export interface ImageData {
  dataUrl: string;
  file: File;
}

interface ColorType {
  idx: number;
  value: string;
}

export type AgoraConfig = {
  title: AgoraTitle;
  imageUrl: ImageURL;
  category: string;
  color: ColorType;
  capacity: number;
  duration: number | null;
};

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
    nickname: string;
    message: string;
  };
};
