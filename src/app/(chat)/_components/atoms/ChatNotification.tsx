'use client';

import { useAgora } from '@/store/agora';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { AGORA_STATUS } from '@/constants/Agora';

export default function ChatNotification() {
  const [showMessage, setShowMessage] = useState(false);
  const { enterAgora } = useAgora(
    useShallow((state) => ({
      enterAgora: state.enterAgora,
    })),
  );

  useEffect(() => {
    if (enterAgora.status === AGORA_STATUS.CLOSED) return () => {};
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [enterAgora.status]);

  return (
    !showMessage &&
    enterAgora.status !== AGORA_STATUS.CLOSED && (
      <div className="flex p-0.5rem pl-1rem pr-1rem">
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg text-center flex flex-col justify-center items-center text-xs lg:text-sm under-mobile:text-xs text-athens-gray-thick p-11 bg-athens-gray dark:bg-dark-light-200 dark:text-dark-line w-full break-keep"
        >
          사용자들간의 쾌적한 토론 환경을 위해 바른말을 사용해주세요.
          <div>토론을 시작하려면 상단의 START 버튼을 눌러주세요.</div>
        </div>
      </div>
    )
  );
}
