import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ChatState {
  start: string;
  observer: number;
  endVoteCount: number;
  duration: number;
  setDiscussionStart: (start: string) => void;
  setDuration: (duration: number) => void;
  setObserver: (observer: number) => void;
  setVoteEndCnt: (voteEndCnt: number) => void;
  reset: () => void;
}

const initialState: ChatState = {
  start: '',
  duration: 30,
  observer: 0,
  endVoteCount: 0,
  setDiscussionStart: () => {},
  setDuration: () => {},
  setObserver: () => {},
  setVoteEndCnt: () => {},
  reset: () => {},
};

// eslint-disable-next-line import/prefer-default-export
export const useChatInfo = create(immer<ChatState>((set) => ({
  ...initialState,

  setDiscussionStart: (start: string) => set({ start }),
  setDuration: (duration: number) => set({ duration }),
  setObserver: (observer: number) => set({ observer }),
  setVoteEndCnt: (endVoteCount: number) => set({ endVoteCount }),
  reset: () => set({
    start: '',
    duration: 30,
    observer: 0,
    endVoteCount: 0,
  }),
})));
