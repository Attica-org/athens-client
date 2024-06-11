export interface AgoraUser {
  id: number,
  nickname: string,
  photoNumber: number,
  type: 'PROS' | 'CONS' | 'OBSERVER'
}
