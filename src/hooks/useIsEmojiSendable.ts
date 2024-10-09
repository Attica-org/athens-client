'use client';

import { useChatInfo } from '@/store/chatInfo';
import { useAgora } from '@/store/agora';
import { useShallow } from 'zustand/react/shallow';

export default function useIsEmojiSendable() {
  // end 상태가 있으면 이모지 전송 불가
  // status가 종료되었다면 이모지 전송 불가
  const { end } = useChatInfo(
    useShallow((state) => ({
      end: state.end,
    })),
  );
  const { status } = useAgora((state) => ({
    status: state.enterAgora.status,
  }));

  if (end || status === 'CLOSED') {
    return false;
  }

  return true;
}
