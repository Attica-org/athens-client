const homeSegmentKey = '/home';
const createAgoraSegmentKey = '/create-agora';
const enterAgoraSegmentKey = '/enter-agora';
const userInfoSegmentKey = '/user-info';
const uploadImageSegmentKey = '/upload-image';

type HomeSegmentKeyType = '/home';
type CreateAgoraSegmentKeyType = '/create-agora';
type EnterAgoraSegmentKeyType = '/enter-agora';
type UserInfoSegmentKeyType = '/user-info';
type UploadImageSegmentKeyType = '/upload-image';

export type SegmentKeyType =
  | HomeSegmentKeyType
  | CreateAgoraSegmentKeyType
  | EnterAgoraSegmentKeyType
  | UserInfoSegmentKeyType
  | UploadImageSegmentKeyType;

export {
  homeSegmentKey,
  createAgoraSegmentKey,
  enterAgoraSegmentKey,
  userInfoSegmentKey,
  uploadImageSegmentKey,
};
