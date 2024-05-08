export interface Agora {
  id: number,
  agoraTitle: string,
  agoraColor: string,
  participants: {
    pros: number,
    cons: number,
    observer: number,
  },
  status: string,
}
