const homeSegmentKey = '/home';
const createAgoraSegmentKey = '/create-agora';
const enterAgoraSegmentKey = '/enter-agora';
const userInfoSegmentKey = '/user-info';
const uploadImageSegmentKey = '/upload-image';

const STORAGE_CURRENT_URL_KEY = 'athens-cur';
const STORAGE_PREVIOUSE_URK_KEY = 'athens-previous';

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
  STORAGE_CURRENT_URL_KEY,
  STORAGE_PREVIOUSE_URK_KEY,
  homeSegmentKey,
  createAgoraSegmentKey,
  enterAgoraSegmentKey,
  userInfoSegmentKey,
  uploadImageSegmentKey,
};
