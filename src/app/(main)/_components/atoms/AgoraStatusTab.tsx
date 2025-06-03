'use client';

import { AgoraTabStatus } from '@/app/model/Agora';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useSearchStore } from '@/store/search';
import { useRouter, usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

function AgoraStatusTab() {
  const { tabStatus, setTabStatus } = useSearchStore(
    useShallow((state) => ({
      setTabStatus: state.setTabStatus,
      tabStatus: state.tabStatus,
    })),
  );
  // const searchParams = useSearchParams();
  const [status, setStatus] = useState<AgoraTabStatus>(
    tabStatus as AgoraTabStatus,
  );
  const router = useRouter();
  const pathname = usePathname();

  const changeParams = useCallback(() => {
    if (pathname !== homeSegmentKey) return;
    const newSearchParams = new URLSearchParams(window.location.search);

    newSearchParams.set('status', status);
    setTabStatus(status);

    const newUrl = `${homeSegmentKey}?${newSearchParams.toString()}`;
    window.history.pushState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl,
    );
  }, [router, status, pathname]);

  useEffect(() => {
    changeParams();
  }, [status, changeParams]);

  const changeStatus = (state: AgoraTabStatus) => {
    setStatus(state);
  };

  return (
    <nav className="flex flex-row justify-around items-center h-2rem w-full text-xs pl-5 pr-5 dark:text-white">
      <button
        aria-label="활성화 상태 아고라 목록 보기"
        onClick={() => changeStatus(AgoraTabStatus.ACTIVE)}
        type="button"
        className={`border-b-1 ${
          status === AgoraTabStatus.ACTIVE
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
          status === 'closed'
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
