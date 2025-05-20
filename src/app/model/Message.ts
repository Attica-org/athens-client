import { AccessStatus } from './AccessStatus';
import { Reaction } from './Reaction';

export interface Message {
  chatId: number;
  user: {
    id: number;
    nickname: string;
    photoNumber: number;
    type: string;
  };
  content: string;
  createdAt: string;
  reactionCount: Reaction;
  access?: AccessStatus;
}
