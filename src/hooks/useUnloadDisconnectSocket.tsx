'use client';

import { useWebSocketClient } from '@/store/webSocket';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  mutation?: () => void;
};

export function useUnloadDisconnectSocket({ mutation }: Props) {
  const { webSocketClient, webSocketClientConnected } = useWebSocketClient(
    useShallow((state) => ({
      webSocketClient: state.webSocketClient,
      webSocketClientConnected: state.webSocketClientConnected,
    })),
  );

  const handleAgoraExit = useCallback(
    (e: BeforeUnloadEvent) => {
      e.preventDefault();

      webSocketClient?.deactivate();

      mutation?.();
    },
    [webSocketClientConnected, mutation],
  );

  useEffect(() => {
    window.onbeforeunload = handleAgoraExit;

    return () => {
      window.onbeforeunload = null;
    };
  }, [mutation, handleAgoraExit]);
}
