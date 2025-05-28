import { AccessStatus } from './AccessStatus';
import { ParticipantPosition, UserName } from './Agora';
import { Reaction } from './Reaction';

export interface Message {
  chatId: number;
  user: {
    id: number;
    nickname: UserName;
    photoNumber: number;
    type: ParticipantPosition | 'ACCESS';
  };
  content: string;
  createdAt: string;
  reactionCount: Reaction;
  access?: AccessStatus;
}

export interface MessagePageParams {
  size: string;
  key?: string;
}

export interface MessageMetaResponse {
  key: number | null;
  effectiveSize: number;
}

type BadWord = {
  start: number;
  end: number;
  keyword: string;
};

export interface BadWordsFilterResponse {
  hasBadWord: boolean;
  badword: BadWord[];
}
