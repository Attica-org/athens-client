'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatNotification() {
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(true);

  // TODO: 전역 상태로 투표 종료 확인, 결과 모달 열기
  const onClick = () => {
    router.push('/agora/flow/result-agora');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex p-0.5rem pl-1rem pr-1rem" onClick={onClick}>
      {showMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg text-center flex justify-center items-center text-sm under-mobile:text-xs text-athens-gray-thick p-11 bg-athens-gray dark:bg-dark-light-200 dark:text-dark-line w-full break-keep"
        >
          사용자들간의 쾌적한 토론 환경을 위해 바른말을 사용해주세요.
        </div>
      )}
    </div>
  );
}
