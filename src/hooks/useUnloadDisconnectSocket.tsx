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

  const handleUnload = useCallback(() => {
    webSocketClient?.deactivate();
    mutation?.();
  }, [webSocketClientConnected, mutation]);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (window) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('unload', handleUnload);
    }
    return () => {
      if (window) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('unload', handleUnload);
      }
    };
  }, [mutation, handleUnload]);
}
