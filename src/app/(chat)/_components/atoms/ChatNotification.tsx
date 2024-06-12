'use client';

import { useChatInfo } from '@/store/chatInfo';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function ChatNotification() {
  const [showMessage, setShowMessage] = useState(false);
  const { end } = useChatInfo(useShallow((state) => ({
    end: state.end,
  })));

  useEffect(() => {
    if (end) return () => {};
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [end]);

  return (
    !showMessage && !end && (
    <div className="flex p-0.5rem pl-1rem pr-1rem">
      <div
        role="alert"
        aria-live="polite"
        className="rounded-lg text-center flex justify-center items-center text-sm under-mobile:text-xs text-athens-gray-thick p-11 bg-athens-gray dark:bg-dark-light-200 dark:text-dark-line w-full break-keep"
      >
        사용자들간의 쾌적한 토론 환경을 위해 바른말을 사용해주세요.
      </div>
    </div>
    )
  );
}
