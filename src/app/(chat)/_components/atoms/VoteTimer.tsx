'use client';

import { useAgora } from '@/store/agora';
import { useChatInfo } from '@/store/chatInfo';
import { postServiceWorkerMessage } from '@/utils/postServiceWorkerMessage';
import isNull from '@/utils/validation/validateIsNull';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function VoteTimer({ baseUrl }: { baseUrl: string }) {
  const [remainingTime, setRemainingTime] = useState(15);
  const agoraId = useAgora((state) => state.enterAgora.id);
  const { data: session } = useSession();
  const { end } = useChatInfo(
    useShallow((state) => ({
      end: state.end,
    })),
  );

  const startTimer = useCallback(
    (voteEndTime: number) => {
      if (!session?.user?.accessToken || isNull(baseUrl)) return;

      postServiceWorkerMessage({
        action: 'startTimer',
        data: {
          voteEndTime,
          agoraId,
          token: session.user.accessToken,
          baseUrl,
        },
      });
    },
    [agoraId, baseUrl, session],
  );

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (end.length) {
      const voteEndTime = new Date(end).getTime() + 15 * 1000;
      startTimer(voteEndTime);

      timerId = setInterval(() => {
        const diffTime = voteEndTime - new Date().getTime();
        setRemainingTime(diffTime > 0 ? Math.floor(diffTime / 1000) : 0);
        if (diffTime <= 0) {
          clearInterval(timerId);
        }
      }, 1000);
    }

    return () => {
      if (!isNull(timerId)) {
        clearInterval(timerId);
      }
    };
  }, [end, startTimer]);

  return (
    <div
      role="status"
      aria-label="투표 종료까지 남은 시간"
      className={`pt-0.5rem ${remainingTime <= 5 && 'text-red-500 dark:text-dark-con-color'}`}
    >
      {remainingTime}
    </div>
  );
}
