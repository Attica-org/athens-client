'use client';

import * as StompJs from '@stomp/stompjs';
import { useCallback, useEffect } from 'react';

type Props = {
  client: StompJs.Client | undefined;
  mutation?: () => void;
};

export function useUnloadDisconnectSocket({ client, mutation }: Props) {
  const handleAgoraExit = useCallback(
    (e: BeforeUnloadEvent) => {
      e.preventDefault();

      if (client) {
        client.deactivate();
      }
      if (mutation) {
        mutation();
      }
    },
    [client, mutation],
  );

  useEffect(() => {
    window.onbeforeunload = handleAgoraExit;

    return () => {
      window.onbeforeunload = null;
    };
  }, [client, mutation, handleAgoraExit]);
}
