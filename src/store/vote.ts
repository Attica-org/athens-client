import { AgoraId, VoteCount } from '@/app/model/Agora';
import { create } from 'zustand';

type VoteResult = {
  id: AgoraId;
  prosCount: VoteCount;
  consCount: VoteCount;
};

interface State {
  voteResult: VoteResult;
  voteEnd: boolean;
}

interface Action {
  setVoteEnd: (voteEnd: boolean) => void;
  setVoteResult: (voteResult: VoteResult) => void;
  reset: () => void;
}

const initialState: State = {
  voteResult: {
    id: 0,
    prosCount: 0,
    consCount: 0,
  },
  voteEnd: false,
};

export const useVoteStore = create<State & Action>((set) => ({
  ...initialState,
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
