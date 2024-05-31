'use client';

import { useChatInfo } from '@/store/chatInfo';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useTimer from '@/hooks/useTimer';

type Props = {
  duration: number;
  start: boolean;
  agoraId: string;
};

export default function DiscussionTimer({ duration, start, agoraId }: Props) {
  const startTime = useChatInfo.getState().start;
  const { isClosed, setIsClosed, voteEndCnt } = useChatInfo(useShallow((state) => ({
    isClosed: state.isClosed, setIsClosed: state.setIsClosed, voteEndCnt: state.voteEndCnt,
  })));
  // const [time, setTime] = useState<string>(calculationRemainingTime(startTime, duration));
  const { formattedTime, isFinished, resetTimer } = useTimer(startTime, duration, start);
  const router = useRouter();

  useEffect(() => {
    if (isFinished && !isClosed && start) {
      setIsClosed(true);
      resetTimer();
      router.push(`/agoras/${agoraId}/flow/end-agora`);
    }
  }, [isFinished, setIsClosed, isClosed, agoraId, router, start, resetTimer]);

  return (
    <div
      role="timer"
      aria-label="토론 제한 시간"
      className="italic border-1 border-athens-main p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg"
    >
      {isClosed ? '00:00' : formattedTime}
    </div>
  );
}
