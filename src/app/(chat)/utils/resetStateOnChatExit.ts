import { useAgora } from '@/store/agora';
import { useChatInfo } from '@/store/chatInfo';
import { useEnter } from '@/store/enter';
import { useSidebarStore } from '@/store/sidebar';
import { useUploadImage } from '@/store/uploadImage';

export const resetStateOnChatExit = () => {
  useEnter.getState().reset();
  useAgora.getState().reset();
  useAgora.getState().enterAgoraReset();
  useUploadImage.getState().resetUploadImageState();
  useChatInfo.getState().reset();
  useSidebarStore.getState().reset();
};
