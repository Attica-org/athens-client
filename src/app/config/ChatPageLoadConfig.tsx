'use client';

import { useAgora } from '@/store/agora';
import { useEnter } from '@/store/enter';
import isNull from '@/utils/validation/validateIsNull';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import showToast from '@/utils/showToast';
import useApiError from '@/hooks/useApiError';
import { homeSegmentKey } from '@/constants/segmentKey';
import { postEnterAgoraInfo } from '../(main)/_lib/postEnterAgoraInfo';
import ChatPageLoading from '../(chat)/_components/atoms/ChatPageLoading';

type Props = {
  children: React.ReactNode;
};

export default function ChatPageLoadConfig({ children }: Props) {
  const { data: session } = useSession();
  const { title: agoraTitle, id: prevAgoraId } = useAgora().enterAgora;
  const {
    enterAgoraReset: agoraInfoReset,
    reset: selectedAgoraInfoReset,
    setEnterAgora,
    setSelectedAgora,
    selectedAgora,
  } = useAgora();
  const userProfilReset = useEnter().reset;
  const agoraId = usePathname().split('/').at(-1);
  const router = useRouter();
  const { handleError } = useApiError();
  const hasMutated = useRef(false);

  const callEnterAgoraAPI = async () => {
    const { selectedProfileImage, selectedPosition, nickname } =
      useEnter.getState();
    const info = {
      ...selectedProfileImage,
      nickname,
      role: selectedPosition,
    };
    return postEnterAgoraInfo({ info, agoraId: prevAgoraId });
  };

  const mutation = useMutation({
    mutationFn: callEnterAgoraAPI,
    onSuccess: async (response) => {
      if (response) {
        if (response === AGORA_STATUS.CLOSED) {
          showToast('종료된 아고라입니다.', 'info');

          setEnterAgora({
            ...selectedAgora,
            id: prevAgoraId,
            userId: response.userId,
            status: AGORA_STATUS.CLOSED,
            role: AGORA_POSITION.OBSERVER,
            isCreator: false,
          });
          setSelectedAgora({
            ...selectedAgora,
            status: AGORA_STATUS.CLOSED,
          });
        } else {
          setEnterAgora({
            ...selectedAgora,
            id: response.agoraId,
            userId: response.userId,
            role: response.type,
            isCreator: response.isCreator,
          });
        }
        return;
      }
      showToast('입장 실패했습니다.\n 다시 시도해주세요.', 'error');
      router.push(homeSegmentKey);
    },
    onError: async (error) => {
      await handleError(error, mutation.mutate);
    },
  });

  const isSameAgora = (prevId: number, currentId: string | undefined) => {
    if (prevId === Number(currentId)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    // 채팅방으로 페이지 이동시 다른 탭에서 이미 입장한 유저라면(session storage 데이터 없음) 내보내기
    if (
      typeof window !== 'undefined' &&
      !isNull(session) &&
      !hasMutated.current
    ) {
      const entries = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;

      if (entries?.type === 'reload') {
        // 입장하기 api 호출
        hasMutated.current = true;
        mutation.mutate();
      }

      if (entries?.type === 'navigate' && isNull(agoraTitle)) {
        // 채팅방 입장하기 페이지 띄우기
        window.location.replace(`/flow/enter-agora/${agoraId}`);
      } else if (
        entries?.type === 'navigate' &&
        !isSameAgora(prevAgoraId, agoraId)
      ) {
        // 채팅방에서 다른 채팅방으로 이동, storage 데이터 초기화 후 입장하기 페이지 띄우기
        agoraInfoReset();
        userProfilReset();
        selectedAgoraInfoReset();

        useAgora.persist.rehydrate();
        useEnter.persist.rehydrate();

        window.location.replace(`/flow/enter-agora/${agoraId}`);
      }
    }
  }, [session]);

  if (
    isNull(session) ||
    isNull(agoraTitle) ||
    !isSameAgora(prevAgoraId, agoraId) ||
    mutation.isPending
  ) {
    return <ChatPageLoading />;
  }

  return children;
}
