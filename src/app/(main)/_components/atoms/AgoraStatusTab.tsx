'use client';

import { AgoraTabStatus } from '@/app/model/Agora';
import { useBrowserTabStatus } from '@/hooks/useBrowerTabStatus';
import React from 'react';

function AgoraStatusTab() {
  const { tabStatus, changeBrowserTabStatus } = useBrowserTabStatus();

  const changeStatus = (state: AgoraTabStatus) => {
    changeBrowserTabStatus(state);
  };

  return (
    <nav className="flex flex-row justify-around items-center h-2rem w-full text-xs pl-5 pr-5 dark:text-white">
      <button
        aria-label="활성화 상태 아고라 목록 보기"
        onClick={() => changeStatus(AgoraTabStatus.ACTIVE)}
        type="button"
        className={`border-b-1 ${
          tabStatus === AgoraTabStatus.ACTIVE
            ? 'border-athens-sub'
            : 'dark:border-dark-light-300'
        } flex flex-1 justify-center p-6`}
      >
        활성화
      </button>
      <button
        aria-label="종료된 아고라 목록 보기"
        onClick={() => changeStatus(AgoraTabStatus.CLOSED)}
        type="button"
        className={`flex flex-1 justify-center p-6 border-b-1 ${
          tabStatus === 'closed'
            ? 'border-athens-sub'
            : 'dark:border-dark-light-300'
        }`}
      >
        종료
      </button>
    </nav>
  );
}

export default React.memo(AgoraStatusTab);
