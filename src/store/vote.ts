import { create } from 'zustand';

interface VoteState {
  voteResult: {
    pros: number;
    cons: number;
  },
  voteEnd: boolean;
  setVoteEnd: (voteEnd: boolean) => void;
  setVoteResult: (voteResult: { pros: number; cons: number }) => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useVoteStore = create<VoteState>((set) => ({
  voteResult: {
    pros: 0,
    cons: 0,
  },
  voteEnd: false,
  setVoteEnd(voteEnd: boolean) {
    set({ voteEnd });
  },
  setVoteResult(voteResult: { pros: number; cons: number }) {
    set({ voteResult });
  },
  reset() {
    set({ voteResult: { pros: 0, cons: 0 } });
  },
}));
