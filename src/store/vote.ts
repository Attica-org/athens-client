import { AgoraId, VoteCount } from '@/app/model/Agora';
import { create } from 'zustand';

type VoteResult = {
  id: AgoraId;
  prosCount: VoteCount;
  consCount: VoteCount;
};

interface VoteState {
  voteResult: VoteResult;
  voteEnd: boolean;
  setVoteEnd: (voteEnd: boolean) => void;
  setVoteResult: (voteResult: VoteResult) => void;
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
  setVoteEnd(voteEnd) {
    set({ voteEnd });
  },
  setVoteResult(voteResult) {
    set({ voteResult });
  },
  reset() {
    set({ voteResult: { id: 0, prosCount: 0, consCount: 0 } });
  },
}));
