'use client';

import { postEnterAgoraInfo } from '@/app/(main)/_lib/postEnterAgoraInfo';
import Loading from '@/app/_components/atoms/loading';
import { useAgora } from '@/store/agora';
import { useEnter } from '@/store/enter';
import tokenManager from '@/utils/tokenManager';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function EnterAgoraButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { selectedAgora, setEnterAgora } = useAgora();
  const redirectURL = tokenManager.getRedirectUrl();

  useEffect(() => {
    // redirectURL과 agoraId가 모두 없으면 홈으로 이동
    if (!selectedAgora.id && !redirectURL && !tokenManager.getToken()) {
      router.replace('/home');
    }
  }, [selectedAgora.id, router, redirectURL]);

  const routePage = () => {
    if (!selectedAgora.id && redirectURL) {
      const agoraId = redirectURL.split('/').pop();
      router.push(`/agoras/${agoraId}`);
    } else if (selectedAgora.id) {
      router.push(`/agoras/${selectedAgora.id}`);
    } else {
      router.push('/home');
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const { selectedProfileImage, selectedPosition, nickname } = useEnter.getState();
      const info = {
        ...selectedProfileImage,
        nickname,
        role: selectedPosition,
      };
      return postEnterAgoraInfo({ info, agoraId: selectedAgora.id });
    },
    onSuccess: async () => {
      setEnterAgora({
        id: selectedAgora.id, title: selectedAgora.title, status: selectedAgora.status,
      });
      routePage();
    },
    onError: () => {
      // console.dir(error);
      // alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const enterAgora = () => {
    const { nickname, setMessage, selectedPosition } = useEnter.getState();

    if (selectedPosition !== 'OBSERVERS') {
      if (nickname.length > 10) {
        setMessage('닉네임은 10자 이내로 입력해주세요.');
        return;
      }
      if (nickname.trim().length === 0) {
        setMessage('닉네임을 입력해주세요.');
        return;
      }
    }

    setIsLoading(() => {
      tokenManager.clearRedirectUrl();
      mutation.mutate();
      return true;
    });
  };

  return (
    <button
      type="button"
      aria-label="아고라 입장하기"
      disabled={isLoading}
      onClick={enterAgora}
      className="mt-2rem text-sm bg-athens-main p-0.5rem w-full text-white rounded-lg"
    >
      {isLoading ? <Loading w="16" h="16" /> : '입장하기'}
    </button>
  );
}
