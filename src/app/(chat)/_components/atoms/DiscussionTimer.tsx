'use client';

import { useChatInfo } from '@/store/chatInfo';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useTimer from '@/hooks/useTimer';
import { useMutation } from '@tanstack/react-query';
import { useAgora } from '@/store/agora';
import showToast from '@/utils/showToast';
import { AGORA_STATUS } from '@/constants/agora';
import useApiError from '@/hooks/useApiError';
import { patchAgoraTimeOut } from '../../_lib/patchAgoraTimeOut';

type Props = {
  duration: number;
};

export default function DiscussionTimer({ duration }: Props) {
  const { start: startTime, end: endTime } = useChatInfo(
    useShallow((state) => ({
      start: state.start,
      end: state.end,
    })),
  );
  const { formattedTime, isFinished, resetTimer } = useTimer(
    startTime,
    duration,
  );
  const { enterAgora, setEnterAgora } = useAgora();
  const { handleError } = useApiError();
  const router = useRouter();

  const agoraEndMutation = useMutation({
    mutationFn: async () => patchAgoraTimeOut(enterAgora.id),
    onSuccess: async (response) => {
      if (response) {
        router.push(`/agoras/${enterAgora.id}/flow/end-agora`);
      }

      showToast('데이터 연결에 실패했습니다.', 'error');
    },
    onError: async (error) => {
      await handleError(error, agoraEndMutation.mutate);
    },
  });

  useEffect(() => {
    if (endTime && !isFinished) {
      // 버튼으로 종료
      resetTimer();
      setEnterAgora({ ...enterAgora, status: AGORA_STATUS.CLOSED });
    } else if (isFinished) {
      // 타임 아웃
      agoraEndMutation.mutate();

      resetTimer();
      setEnterAgora({ ...enterAgora, status: AGORA_STATUS.CLOSED });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, enterAgora.id, router, startTime, resetTimer, endTime]);

  const parseTimeString = (timeStr: string): [number, number] => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return [minutes, seconds];
  };

  const [remainingMinutes, remainingSeconds] = parseTimeString(formattedTime);

  return (
    <div
      aria-describedby="chat-timer"
      role="timer"
      className="text-xs italic border-1 border-athens-main p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg"
    >
      <span aria-hidden="true">{isFinished ? '00:00' : formattedTime}</span>
      <span id="chat-timer" className="sr-only">
        토론 종료까지 {remainingMinutes}분 {remainingSeconds}초 남았습니다.
      </span>
    </div>
  );
}
