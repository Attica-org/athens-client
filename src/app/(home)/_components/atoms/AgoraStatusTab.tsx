'use client';

import React, { useState } from 'react';

type Status = 'active' | 'end';

export default function AgoraStatusTab() {
  const [status, setStatus] = useState<Status>('active');

  const changeStatus = () => {
    setStatus(status === 'active' ? 'end' : 'active');
  };

  return (
    <nav className="flex flex-row justify-around items-center h-2rem w-full text-xs pl-5 pr-5 dark:text-white">
      <button
        aria-label="활성화 상태 아고라 목록 보기"
        onClick={changeStatus}
        type="button"
        className={`border-b-1 ${
          status === 'active' ? 'border-athens-sub' : 'dark:border-dark-light-300'
        } flex flex-1 justify-center p-6`}
      >
        활성화
      </button>
      <button
        aria-label="종료된 아고라 목록 보기"
        onClick={changeStatus}
        type="button"
        className={`flex flex-1 justify-center p-6 border-b-1 ${
          status === 'end' ? 'border-athens-sub' : 'dark:border-dark-light-300'
        }`}
      >
        종료
      </button>
    </nav>
  );
}
