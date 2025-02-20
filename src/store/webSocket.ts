import { create } from 'zustand';
import * as StompJs from '@stomp/stompjs';
import isNull from '@/utils/validation/validateIsNull';

interface WebSocketClient {
  webSocketClient: StompJs.Client | null;
  setWebSocketClient: (newClient: StompJs.Client | null) => void;
  webSocketClientConnected: boolean;
}

export const useWebSocketClient = create<WebSocketClient>((set) => ({
  webSocketClient: null,
  setWebSocketClient: (newClient) => {
    set((state) => ({
      ...state,
      webSocketClient: newClient,
      webSocketClientConnected: !isNull(newClient),
    }));
  },
  webSocketClientConnected: false,
}));
