import { AgoraTitle, Duration, UserName } from '@/app/model/Agora';
import { MemberId } from '@/app/model/Chat';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

enableMapSet();

interface ChatState {
  title: AgoraTitle;
  start: string;
  end: string;
  observer: number;
  duration: Duration;
  participants: Map<number, string>;
  isEmptyParticipants: boolean;
  setTitle: (title: AgoraTitle) => void;
  setDiscussionStart: (start: string) => void;
  setDiscussionEnd: (end: string) => void;
  setDuration: (duration: Duration) => void;
  setObserver: (observer: number) => void;
  reset: () => void;
  addParticipant: (id: MemberId, username: UserName) => void;
  removeParticipant: (id: MemberId) => void;
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

export const useChatInfo = create(
  immer<ChatState>((set) => ({
    ...initialState,

    setTitle: (title) => set({ title }),
    setDiscussionStart: (start) => set({ start }),
    setDiscussionEnd: (end) => set({ end }),
    setDuration: (duration) => set({ duration }),
    setObserver: (observer) => set({ observer }),
    reset: () =>
      set({
        title: '',
        start: '',
        end: '',
        duration: 30,
        observer: 0,
        participants: new Map(),
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
