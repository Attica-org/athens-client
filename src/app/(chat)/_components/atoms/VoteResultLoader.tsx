import Loading from '@/app/_components/atoms/loading';
import React from 'react';

type Props = {
  isFinished: boolean;
  isVoteEnd: boolean;
};

export default function VoteResultLoader({ isFinished, isVoteEnd }: Props) {
  return (
    isFinished &&
    !isVoteEnd && (
      <div className="flex p-10 text-sm">
        투표 결과 집계 중...
        <Loading
          w="16"
          h="16"
          className="m-2 flex justify-center items-center"
        />
      </div>
    )
  );
}
