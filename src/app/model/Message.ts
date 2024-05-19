// export interface Message {
//   messageId: number;
//   role: string;
//   name: string;
//   content: string;
//   createdAt: string;
// }

export interface Message {
  chatId: string,
  sender: {
    id: string,
    name: string,
    photoNum: number,
    role: string,
  },
  content: string,
  createdAt: string,
}
