import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ChatState {
  start: string;
  isClosed: boolean;
  observer: number;
  voteEndCnt: number;
  duration: number;
  setIsClosed: (isClosed: boolean) => void;
  setDiscussionStart: (start: string) => void;
  setDuration: (duration: number) => void;
  setObserver: (observer: number) => void;
  setVoteEndCnt: (voteEndCnt: number) => void;
  reset: () => void;
}

const initialState: ChatState = {
  start: '2024-05-31T12:46:26.251Z',
  isClosed: false,
  duration: 30,
  observer: 0,
  voteEndCnt: 0,
  setIsClosed: () => {},
  setDiscussionStart: () => {},
  setDuration: () => {},
  setObserver: () => {},
  setVoteEndCnt: () => {},
  reset: () => {},
};

// eslint-disable-next-line import/prefer-default-export
export const useChatInfo = create(immer<ChatState>((set) => ({
  ...initialState,

  setIsClosed: (isClosed: boolean) => set({ isClosed }),
  setDiscussionStart: (start: string) => set({ start }),
  setDuration: (duration: number) => set({ duration }),
  setObserver: (observer: number) => set({ observer }),
  setVoteEndCnt: (voteEndCnt: number) => set({ voteEndCnt }),
  reset: () => set({
    start: '2024-05-31T12:46:26.251Z',
    isClosed: false,
    duration: 30,
    observer: 0,
    voteEndCnt: 0,
  }),
})));
