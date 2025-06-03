'use client';

import { useAgora } from '@/store/agora';
import { useEnter } from '@/store/enter';
import isNull from '@/utils/validation/validateIsNull';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AGORA_STATUS } from '@/constants/agora';
import showToast from '@/utils/showToast';
import useApiError from '@/hooks/useApiError';
import {
  STORAGE_PREVIOUSE_URL_KEY,
  homeSegmentKey,
} from '@/constants/segmentKey';
import { getSelectedAgoraQueryKey as getSelectedAgoraTags } from '@/constants/queryKey';
import { COLOR } from '@/constants/consts';
import {
  FinishedAgoraInfo,
  postEnterAgoraInfo,
} from '../(main)/_lib/postEnterAgoraInfo';
import ChatPageLoading from '../(chat)/_components/atoms/ChatPageLoading';
import { AgoraTitleResponse, ParticipantPosition } from '../model/Agora';
import { getAgoraTitle } from '../(main)/_lib/getAgoraTitle';

type Props = {
  children: React.ReactNode;
};

export default function ChatPageLoadConfig({ children }: Props) {
  const { data: session } = useSession();
  const {
    enterAgora,
    enterAgoraReset: agoraInfoReset,
    reset: selectedAgoraInfoReset,
    setEnterAgora,
    setSelectedAgora,
    selectedAgora,
  } = useAgora();
  const userProfilReset = useEnter().reset;
  const agoraId = usePathname().split('/').at(-1);
  const { handleError } = useApiError();
  const hasMutated = useRef(false);
  const isAccessToAnotherAgora = useRef(false);

  const callEnterAgoraAPI = async () => {
    const { selectedProfileImage, selectedPosition, nickname } =
      useEnter.getState();
    const info = {
      ...selectedProfileImage,
      nickname,
      role: selectedPosition,
    };
    return postEnterAgoraInfo({ info, agoraId: selectedAgora.id });
  };

  const activeAgoraEnterMutation = useMutation({
    mutationFn: callEnterAgoraAPI,
    onSuccess: async (response) => {
      if (response) {
        if (response.agoraId === FinishedAgoraInfo.agoraId) {
          showToast('종료된 아고라입니다.', 'info');

          setEnterAgora({
            ...selectedAgora,
            id: selectedAgora.id,
            userId: response.userId,
            status: AGORA_STATUS.CLOSED,
            role: ParticipantPosition.OBSERVER,
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
      window.location.replace(homeSegmentKey);
    },
    onError: async (error) => {
      await handleError(error, activeAgoraEnterMutation.mutate);
    },
  });

  const isRedirect =
    isNull(selectedAgora.agoraTitle) && isNull(enterAgora.agoraTitle);

  const {
    data: agoraInfo,
    isLoading: LoadingGetBasicFacts,
    isError,
  }: {
    data: AgoraTitleResponse | undefined;
    isLoading: boolean;
    isError: boolean;
  } = useQuery({
    queryKey: getSelectedAgoraTags(agoraId || ''),
    queryFn: (query) => {
      return getAgoraTitle(query);
    },
    enabled: isAccessToAnotherAgora.current === true || isRedirect,
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
      !hasMutated.current &&
      !isNull(selectedAgora.status)
    ) {
      const entries = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const sessionNavigatorPrevious = sessionStorage.getItem(
        STORAGE_PREVIOUSE_URL_KEY,
      );

      const previousUrl = `${window.location.origin}${sessionNavigatorPrevious ?? ''}`;

      // 같은 채팅방일 때 (RELOAD)
      // 기존 아고라가 CLOSED라면 종료된 아고라 입장하기 API 호출 (X -> get 요청임)
      if (entries?.type === 'reload' && previousUrl === window.location.href) {
        hasMutated.current = true;
        // 기존 아고라가 ACTIVE라면 재입장 API 호출
        if (
          selectedAgora.status === AGORA_STATUS.QUEUED ||
          selectedAgora.status === AGORA_STATUS.RUNNING
        ) {
          activeAgoraEnterMutation.mutate();
        }
      } else if (
        entries?.type === 'navigate' &&
        isNull(selectedAgora.agoraTitle)
      ) {
        // 외부에서 채팅방 접근시 채팅방 입장하기 페이지 띄우기
        window.location.replace(`/flow/enter-agora/${agoraId}`);
      } else if (
        entries?.type === 'navigate' &&
        !isSameAgora(selectedAgora.id, agoraId)
      ) {
        // 채팅방에서 다른 채팅방으로 이동 시, 넘어간 채팅방의 유효성(CLOSED인지, ACTIVE인지, 없는지)을 먼저 검사해야함
        // storage 데이터 초기화 후 입장하기 페이지 띄우기
        isAccessToAnotherAgora.current = true;
        userProfilReset();
        window.location.replace(`/flow/enter-agora/${agoraId}`);
      }
    }
  }, [session]);

  useEffect(() => {
    if (!isNull(agoraInfo) && (isRedirect || isAccessToAnotherAgora.current)) {
      // CLOSED AGORA일 때, 종료된 아고라 showToast 띄우기
      if (agoraInfo.status === AGORA_STATUS.CLOSED) {
        setSelectedAgora({
          id: Number(agoraId),
          imageUrl: '',
          agoraTitle: agoraInfo.title,
          status: agoraInfo.status,
          agoraColor: COLOR[0].value,
        });
        setEnterAgora({
          ...selectedAgora,
          id: Number(agoraId),
          imageUrl: '',
          agoraTitle: agoraInfo.title,
          status: agoraInfo.status,
          userId: enterAgora.userId,
          role: ParticipantPosition.OBSERVER,
          isCreator: false,
        });

        useAgora.persist.rehydrate();
        useEnter.persist.rehydrate();
      }
      // ACTIVE AGORA일 때, /flow 입장하기 모달 출력
      if (
        agoraInfo.status === AGORA_STATUS.QUEUED ||
        agoraInfo.status === AGORA_STATUS.RUNNING
      ) {
        agoraInfoReset();
        selectedAgoraInfoReset();

        useAgora.persist.rehydrate();
        useEnter.persist.rehydrate();

        isAccessToAnotherAgora.current = true;
        window.location.replace(`/flow/enter-agora/${agoraId}`);
      }
    }
  }, [agoraInfo]);

  if (isError) {
    window.location.replace(homeSegmentKey);
    return null;
  }

  const isLoadingInActiveAgora =
    (selectedAgora.status === AGORA_STATUS.QUEUED ||
      selectedAgora.status === AGORA_STATUS.RUNNING) &&
    activeAgoraEnterMutation.isPending;

  const isLoadingInClosedAgora =
    selectedAgora.status === AGORA_STATUS.CLOSED && LoadingGetBasicFacts;

  if (
    isNull(session) ||
    isLoadingInActiveAgora ||
    isLoadingInClosedAgora ||
    LoadingGetBasicFacts
  ) {
    return <ChatPageLoading />;
  }

  if (!isNull(enterAgora.agoraTitle)) {
    return children;
  }
}
