'use client';

import { useAgora } from '@/store/agora';
import { useEnter } from '@/store/enter';
import isNull from '@/utils/validation/validateIsNull';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function ChatPageLoadConfig({ children }: Props) {
  const { data: session } = useSession();
  const { title: agoraTitle, id: prevAgoraId } = useAgora().enterAgora;
  const agoraInfoReset = useAgora().enterAgoraReset;
  const userProfilReset = useEnter().reset;
  const agoraId = usePathname().split('/').at(-1);

  useEffect(() => {
    // 채팅방으로 페이지 이동시 다른 탭에서 이미 입장한 유저라면(session storage 데이터 없음) 내보내기
    if (typeof window !== 'undefined' && !isNull(session)) {
      const entries = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;

      if (entries?.type === 'navigate' && isNull(agoraTitle)) {
        // 채팅방 입장하기 페이지 띄우기
        window.location.replace(`/flow/enter-agora/${agoraId}`);
      } else if (entries?.type === 'navigate' && !isNull(agoraTitle)) {
        // 채팅방에서 다른 채팅방으로 이동, storage 데이터 초기화 후 입장하기 페이지 띄우기
        agoraInfoReset();
        userProfilReset();

        useAgora.persist.rehydrate();
        useEnter.persist.rehydrate();

        window.location.replace(`/flow/enter-agora/${agoraId}`);
      }
    }
  }, [session]);

  const isSameAgora = (prevId: number, currentId: string | undefined) => {
    if (prevId === Number(currentId)) {
      return true;
    }
    return false;
  };

  if (
    isNull(session) ||
    isNull(agoraTitle) ||
    !isSameAgora(prevAgoraId, agoraId)
  ) {
    return <div className="text-white">페이지 로딩 중</div>;
  }

  return children;
}
