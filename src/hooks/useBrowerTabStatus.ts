import { AgoraTabStatus } from '@/app/model/Agora';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useSearchStore } from '@/store/search';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const useBrowserTabStatus = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { tabStatus, setTabStatus } = useSearchStore(
    useShallow((state) => ({
      setTabStatus: state.setTabStatus,
      tabStatus: state.tabStatus,
    })),
  );

  useEffect(() => {
    const status = searchParams.get('status');
    const validStatus =
      status === AgoraTabStatus.ACTIVE || status === AgoraTabStatus.CLOSED
        ? (status as AgoraTabStatus)
        : AgoraTabStatus.ACTIVE;

    setTabStatus(validStatus);
  }, []);

  const changeBrowserTabStatus = useCallback(
    (tabState: AgoraTabStatus) => {
      if (pathname !== homeSegmentKey) return;
      const newSearchParams = new URLSearchParams(window.location.search);

      setTabStatus(tabState);
      newSearchParams.set('status', tabState);

      const newUrl = `${homeSegmentKey}?${newSearchParams.toString()}`;
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl,
      );
    },
    [pathname, setTabStatus],
  );

  return {
    tabStatus,
    changeBrowserTabStatus,
  };
};
