import * as StompJs from '@stomp/stompjs';

export const unloadDisconnectSocket = (client: StompJs.Client) => {
  const handleUnload = () => {
    if (client && client.connected) {
      client.deactivate();
    }

    // window unload 시 퇴장 api 호출
  };

  window.addEventListener('beforeunload', handleUnload);
};
