'use client';

import { Status } from '@/app/model/Agora';
import { AGORA_STATUS } from '@/constants/agora';
import { useWebSocketClient } from '@/store/webSocket';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  mutation?: () => void;
  agoraStatus: Status | '';
};

export function useUnloadDisconnectSocket({ mutation, agoraStatus }: Props) {
  const { webSocketClient } = useWebSocketClient(
    useShallow((state) => ({
      webSocketClient: state.webSocketClient,
      webSocketClientConnected: state.webSocketClientConnected,
    })),
  );

  const handleUnload = useCallback(() => {
    webSocketClient?.deactivate();
    if (agoraStatus !== AGORA_STATUS.CLOSED) {
      mutation?.();
    }
  }, [webSocketClient, mutation]);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
  }, []);

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
  }, [mutation, handleUnload, handleBeforeUnload]);
}
