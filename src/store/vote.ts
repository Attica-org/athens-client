import { create } from 'zustand';

interface VoteState {
  voteResult: {
    id: number,
    prosCount: number;
    consCount: number;
  },
  voteEnd: boolean;
  setVoteEnd: (voteEnd: boolean) => void;
  setVoteResult: (voteResult: { id: number; prosCount: number; consCount: number }) => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useVoteStore = create<VoteState>((set) => ({
  voteResult: {
    id: 0,
    prosCount: 0,
    consCount: 0,
  },
  voteEnd: false,
  setVoteEnd(voteEnd: boolean) {
    set({ voteEnd });
  },
  setVoteResult(voteResult: { id: number; prosCount: number; consCount: number }) {
    set({ voteResult });
  },
  reset() {
    set({ voteResult: { id: 0, prosCount: 0, consCount: 0 } });
  },
}));
