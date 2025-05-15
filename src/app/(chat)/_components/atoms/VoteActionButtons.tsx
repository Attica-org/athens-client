import React, { useCallback, useEffect, useState } from 'react';
import { VotePosition } from '@/app/model/Agora';
import { AGORA_POSITION } from '@/constants/agora';
import { postServiceWorkerMessage } from '@/utils/postServiceWorkerMessage';

type Props = {
  disabled: boolean;
};

export default function VoteActionButtons({ disabled }: Props) {
  const [selectedResultPosition, setSelectedResultPosition] =
    useState<VotePosition>(AGORA_POSITION.DEFAULT);
  const [vote, setVote] = useState<string | null>(null);

  const selectResultPosition = (position: VotePosition) => {
    setSelectedResultPosition(position);
    setVote(position);
  };

  const updateVoteState = useCallback(() => {
    postServiceWorkerMessage({
      action: 'updateVote',
      data: {
        voteType: vote,
      },
    });
  }, [vote]);

  // 투표 상태 업데이트
  useEffect(() => {
    updateVoteState();
  }, [vote, updateVoteState]);

  const selectResultPositionByKeyboard =
    (type: VotePosition) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        selectResultPosition(type);
      }
    };

  return (
    <div className="pt-0.5rem pb-0.5rem">
      <button
        type="button"
        aria-label="찬성"
        disabled={disabled}
        onClick={() => selectResultPosition(AGORA_POSITION.PROS)}
        onKeyDown={selectResultPositionByKeyboard(AGORA_POSITION.PROS)}
        className={`${
          selectedResultPosition === AGORA_POSITION.PROS
            ? 'bg-blue-400 text-white'
            : 'text-blue-600 bg-white dark:text-white dark:bg-dark-light-500'
        } mr-1rem text-sm p-6 pl-1.5rem pr-1.5rem rounded-xl`}
      >
        찬성
      </button>
      <button
        type="button"
        aria-label="반대"
        disabled={disabled}
        onClick={() => selectResultPosition(AGORA_POSITION.CONS)}
        onKeyDown={selectResultPositionByKeyboard(AGORA_POSITION.CONS)}
        className={`${
          selectedResultPosition === AGORA_POSITION.CONS
            ? 'bg-red-400 text-white '
            : 'bg-white text-red-500 dark:text-white dark:bg-dark-light-500'
        } text-sm p-6 pl-1.5rem pr-1.5rem rounded-xl`}
      >
        반대
      </button>
    </div>
  );
}
