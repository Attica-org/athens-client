const homeSegmentKey = '/home';
const createAgoraSegmentKey = '/create-agora';
const enterAgoraSegmentKey = '/enter-agora';
const userInfoSegmentKey = '/user-info';

type HomeSegmentKeyType = '/home';
type CreateAgoraSegmentKeyType = '/create-agora';
type EnterAgoraSegmentKeyType = '/enter-agora';
type UserInfoSegmentKeyType = '/user-info';

export type SegmentKeyType =
  | HomeSegmentKeyType
  | CreateAgoraSegmentKeyType
  | EnterAgoraSegmentKeyType
  | UserInfoSegmentKeyType;

export {
  homeSegmentKey,
  createAgoraSegmentKey,
  enterAgoraSegmentKey,
  userInfoSegmentKey,
};
