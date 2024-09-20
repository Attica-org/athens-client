const homeSegmentKey = '/home';
const createAgoraSegmentKey = '/create-agora';
const enterAgoraSegmentKey = '/enter-agora';

type HomeSegmentKeyType = '/home';
type CreateAgoraSegmentKeyType = '/create-agora';
type EnterAgoraSegmentKeyType = '/enter-agora';

export type SegmentKeyType =
  | HomeSegmentKeyType
  | CreateAgoraSegmentKeyType
  | EnterAgoraSegmentKeyType;

export { homeSegmentKey, createAgoraSegmentKey, enterAgoraSegmentKey };
