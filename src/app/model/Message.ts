// export interface Message {
//   messageId: number;
//   role: string;
//   name: string;
//   content: string;
//   createdAt: string;
// }

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
}
