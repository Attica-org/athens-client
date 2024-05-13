'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';

type Status = 'active' | 'closed';

function AgoraStatusTab() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>(searchParams.get('st') as Status || 'active');
  const router = useRouter();

  const changeParams = useCallback((state: Status) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set('st', state);
    router.replace(`/?${newSearchParams.toString()}`);
  }, [router, searchParams]);

  const changeStatus = (state: Status) => {
    setStatus(() => {
      const nextStatus = state;
      changeParams(nextStatus);
      return nextStatus;
    });
  };

  return (
    <nav className="flex flex-row justify-around items-center h-2rem w-full text-xs pl-5 pr-5 dark:text-white">
      <button
        aria-label="활성화 상태 아고라 목록 보기"
        onClick={() => changeStatus('active')}
        type="button"
        className={`border-b-1 ${
          status === 'active' ? 'border-athens-sub' : 'dark:border-dark-light-300'
        } flex flex-1 justify-center p-6`}
      >
        활성화
      </button>
      <button
        aria-label="종료된 아고라 목록 보기"
        onClick={() => changeStatus('closed')}
        type="button"
        className={`flex flex-1 justify-center p-6 border-b-1 ${
          status === 'closed' ? 'border-athens-sub' : 'dark:border-dark-light-300'
        }`}
      >
        종료
      </button>
    </nav>
  );
}

export default React.memo(AgoraStatusTab);
