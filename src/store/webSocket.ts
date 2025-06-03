import { create } from 'zustand';
import * as StompJs from '@stomp/stompjs';
import isNull from '@/utils/validation/validateIsNull';

interface State {
  webSocketClient: StompJs.Client | null;
  webSocketClientConnected: boolean;
}

interface Action {
  setWebSocketClient: (newClient: StompJs.Client | null) => void;
}

const initialState: State = {
  webSocketClient: null,
  webSocketClientConnected: false,
};

export const useWebSocketClient = create<State & Action>((set) => ({
  ...initialState,
  setWebSocketClient: (newClient) => {
    set((state) => ({
      ...state,
      webSocketClient: newClient,
      webSocketClientConnected: !isNull(newClient),
    }));
  },
}));
