'use client';

import { useChatInfo } from '@/store/chatInfo';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useTimer from '@/hooks/useTimer';
import { useMutation } from '@tanstack/react-query';
import { useAgora } from '@/store/agora';
import showToast from '@/utils/showToast';
import { patchAgoraTimeOut } from '../../_lib/patchAgoraTimeOut';

type Props = {
  duration: number;
};

export default function DiscussionTimer({ duration }: Props) {
  const startTime = useChatInfo.getState().start;
  const { start, end } = useChatInfo(useShallow((state) => ({
    start: state.start,
    end: state.end,
  })));
  const { formattedTime, isFinished, resetTimer } = useTimer(startTime, duration);
  const { enterAgora, setEnterAgora } = useAgora();
  const router = useRouter();

  const agoraEnd = useMutation({
    mutationFn: async () => patchAgoraTimeOut(enterAgora.id),
    onMutate: () => {
    },
    onSuccess: async (response) => {
      if (response) {
        router.push(`/agoras/${enterAgora.id}/flow/end-agora`);
      } else {
        showToast('데이터 연결에 실패했습니다.', 'error');
      }
    },
    onError: () => {
      // console.dir(error);
      // alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  useEffect(() => {
    if ((isFinished && start) || end) {
      resetTimer();
      // agoraEnd.mutate();
      setEnterAgora({ ...enterAgora, status: 'CLOSED' });
      router.push(`/agoras/${enterAgora.id}/flow/end-agora`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, enterAgora.id, router, start, resetTimer, end]);

  return (
    <div
      role="timer"
      aria-label="토론 제한 시간"
      className="italic border-1 border-athens-main p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg"
    >
      {isFinished ? '00:00' : formattedTime}
    </div>
  );
}
