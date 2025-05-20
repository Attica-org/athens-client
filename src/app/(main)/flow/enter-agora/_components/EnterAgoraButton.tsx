'use client';

import { postEnterAgoraInfo } from '@/app/(main)/_lib/postEnterAgoraInfo';
import Loading from '@/app/_components/atoms/loading';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useAgora } from '@/store/agora';
import { useEnter } from '@/store/enter';
import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import useApiError from '@/hooks/useApiError';
import showToast from '@/utils/showToast';
import { useShallow } from 'zustand/react/shallow';

export default function EnterAgoraButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleError } = useApiError();
  const pathname = usePathname();

  const router = useRouter();
  const { selectedAgora, setSelectedAgora, setEnterAgora } = useAgora(
    useShallow((state) => ({
      selectedAgora: state.selectedAgora,
      setSelectedAgora: state.setSelectedAgora,
      setEnterAgora: state.setEnterAgora,
    })),
  );

  const routePage = () => {
    if (!selectedAgora.id) {
      const agoraId = pathname.split('/')[3];

      router.push(`/agoras/${agoraId}`);
    } else if (selectedAgora.id) {
      router.push(`/agoras/${selectedAgora.id}`);
    } else {
      router.push(homeSegmentKey);
    }
  };

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

  const mutation = useMutation({
    mutationFn: callEnterAgoraAPI,
    onSuccess: async (response) => {
      if (response) {
        if (response === AGORA_STATUS.CLOSED) {
          showToast('종료된 아고라입니다.', 'info');

          setEnterAgora({
            id: Number(pathname.split('/')[3]),
            userId: response.userId,
            imageUrl: selectedAgora.imageUrl,
            title: selectedAgora.title,
            status: AGORA_STATUS.CLOSED,
            role: AGORA_POSITION.OBSERVER,
            isCreator: false,
            agoraColor: selectedAgora.agoraColor,
          });
          setSelectedAgora({
            ...selectedAgora,
            status: AGORA_STATUS.CLOSED,
          });
        } else {
          setEnterAgora({
            id: response.agoraId,
            userId: response.userId,
            imageUrl: selectedAgora.imageUrl,
            title: selectedAgora.title,
            status: selectedAgora.status,
            role: response.type,
            isCreator: response.isCreator,
            agoraColor: selectedAgora.agoraColor,
          });
        }
        routePage();
        return;
      }
      setIsLoading(false);
      showToast('입장 실패했습니다.\n 다시 시도해주세요.', 'error');
    },
    onError: async (error) => {
      setIsLoading(false);
      await handleError(error, mutation.mutate);
    },
  });

  const enterAgora = () => {
    const { nickname, setMessage, selectedPosition } = useEnter.getState();

    if (selectedPosition !== AGORA_POSITION.OBSERVER) {
      if (nickname.length > 10) {
        setMessage('닉네임은 10자 이내로 입력해주세요.');
        return;
      }
      if (nickname.trim().length === 0) {
        setMessage('닉네임을 입력해주세요.');
        return;
      }
    }

    setIsLoading(true);
    mutation.mutate();
  };

  return (
    <button
      type="button"
      aria-label="아고라 입장하기"
      disabled={isLoading}
      onClick={enterAgora}
      className="mt-2rem text-sm bg-athens-main p-0.5rem w-full text-white rounded-lg"
    >
      {isLoading ? (
        <Loading
          w="16"
          h="16"
          className="m-2 flex justify-center items-center"
        />
      ) : (
        '입장하기'
      )}
    </button>
  );
}
