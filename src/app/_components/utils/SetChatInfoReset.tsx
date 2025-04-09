'use client';

import { useAgora } from '@/store/agora';
import { useEnter } from '@/store/enter';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import isNull from '@/utils/validation/validateIsNull';
import { usePathname } from 'next/navigation';
import { useChatInfo } from '@/store/chatInfo';

export default function SetChatInfoReset() {
  const {
    enterAgoraReset: agoraInfoReset,
    reset: selectedAgoraInfoReset,
    selectedAgora,
  } = useAgora(
    useShallow((state) => ({
      selectedAgora: state.selectedAgora,
      enterAgoraReset: state.enterAgoraReset,
      reset: state.reset,
    })),
  );

  const { resetParticipants } = useChatInfo(
    useShallow((state) => ({
      resetParticipants: state.resetParticipants,
    })),
  );

  const { reset: userProfileReset } = useEnter();
  const pathname = usePathname();

  useEffect(() => {
    // 채팅방 정보 및 유저 채팅 프로필 정보 초기화
    if (typeof window !== 'undefined' && !pathname.startsWith('/flow')) {
      const entries = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;

      if (entries?.type === 'navigate' && !isNull(selectedAgora.id)) {
        // 채팅방에서 다른 채팅방으로 이동, storage 데이터 초기화 후 입장하기 페이지 띄우기
        agoraInfoReset();
        userProfileReset();
        selectedAgoraInfoReset();
        resetParticipants();

        useAgora.persist.rehydrate();
        useEnter.persist.rehydrate();
      }
    }
  }, [agoraInfoReset, pathname, selectedAgoraInfoReset, userProfileReset]);

  return null;
}
