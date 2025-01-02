import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

enableMapSet();

interface ChatState {
  title: string;
  start: string;
  observer: number;
  duration: number;
  end: string;
  participants: Map<number, string>;
  isEmptyParticipants: boolean;
  setTitle: (title: string) => void;
  setDiscussionStart: (start: string) => void;
  setDiscussionEnd: (end: string) => void;
  setDuration: (duration: number) => void;
  setObserver: (observer: number) => void;
  reset: () => void;
  addParticipant: (id: number, username: string) => void;
  removeParticipant: (id: number) => void;
  resetParticipants: () => void;
}

const initialState: ChatState = {
  title: '',
  start: '',
  end: '',
  duration: 30,
  observer: 0,
  participants: new Map(),
  isEmptyParticipants: true,
  setTitle: () => {},
  setDiscussionStart: () => {},
  setDiscussionEnd: () => {},
  setDuration: () => {},
  setObserver: () => {},
  reset: () => {},
  addParticipant: () => {},
  removeParticipant: () => {},
  resetParticipants: () => {},
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
    addParticipant: (id, username) =>
      set((state) => {
        const updatedParticipants = new Map(state.participants);
        updatedParticipants.set(id, username);
        return { participants: updatedParticipants };
      }),
    removeParticipant: (id) =>
      set((state) => {
        const updatedParticipants = new Map(state.participants);
        updatedParticipants.delete(id);
        return { participants: updatedParticipants };
      }),
    resetParticipants: () =>
      set({
        participants: new Map(),
      }),
  })),
);
