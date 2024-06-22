import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ChatState {
  title: string;
  start: string;
  observer: number;
  duration: number;
  end: string;
  setTitle: (title: string) => void;
  setDiscussionStart: (start: string) => void;
  setDiscussionEnd: (end: string) => void;
  setDuration: (duration: number) => void;
  setObserver: (observer: number) => void;
  reset: () => void;
}

const initialState: ChatState = {
  title: '',
  start: '',
  end: '',
  duration: 30,
  observer: 0,
  setTitle: () => {},
  setDiscussionStart: () => {},
  setDiscussionEnd: () => {},
  setDuration: () => {},
  setObserver: () => {},
  reset: () => {},
};

// eslint-disable-next-line import/prefer-default-export
export const useChatInfo = create(
  immer<ChatState>((set) => ({
    ...initialState,

    setTitle: (title: string) => set({ title }),
    setDiscussionStart: (start: string) => set({ start }),
    setDiscussionEnd: (end: string) => set({ end }),
    setDuration: (duration: number) => set({ duration }),
    setObserver: (observer: number) => set({ observer }),
    reset: () =>
      set({
        title: '',
        start: '',
        end: '',
        duration: 30,
        observer: 0,
      }),
  })),
);
