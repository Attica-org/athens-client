import { create } from 'zustand';
import * as StompJs from '@stomp/stompjs';

interface WebSocketClient {
  webSocketClient: StompJs.Client | null;
  setWebSocketClient: (newClient: StompJs.Client | null) => void;
  webSocketClientConnected: boolean;
  setWebSocketClientConnected: (connected: boolean) => void;
}

export const useWebSocketClient = create<WebSocketClient>((set) => ({
  webSocketClient: null,
  setWebSocketClient: (newClient) => {
    set({ webSocketClient: newClient });
  },
  webSocketClientConnected: false,
  setWebSocketClientConnected: (connected) => {
    console.log('zustand state set Connected', connected);
    set({ webSocketClientConnected: connected });
  },
}));
