'use client';

import * as StompJs from '@stomp/stompjs';
import { useEffect } from 'react';
import { swalConfirmCancelAlert } from '../../../utils/swalAlert';

type Props = {
  client: StompJs.Client | undefined;
  mutation?: () => void;
};

export default function UnloadDisconnectSocket({ client, mutation }: Props) {
  const handleAgoraExit = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    swalConfirmCancelAlert
      .fire({
        icon: 'warning',
        title: '아고라를 나가시겠습니까?',
        text: '설정한 프로필은 초기화됩니다.',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (client && client.connected) {
            client.deactivate();
          }
          if (mutation) {
            mutation();
          }
        }
      });
  };
  useEffect(() => {
    window.onbeforeunload = handleAgoraExit;

    return () => {
      window.onbeforeunload = null;
    };
  }, [client, mutation]);

  return null;
}
