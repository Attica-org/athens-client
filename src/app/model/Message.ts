// export interface Message {
//   messageId: number;
//   role: string;
//   name: string;
//   content: string;
//   createdAt: string;
// }
import { Reaction } from './Reaction';

export type AccessStatus = 'enter' | 'exit' | 'kicked';

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
