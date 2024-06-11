import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useAgora } from '@/store/agora';
import { useVoteStore } from '@/store/vote';
import { getVoteResult } from '../../_lib/getVoteResult';

type Props = {
  agoraId: number;
};

export default function VoteResult({ agoraId }: Props) {
  const result = useVoteStore((state) => state.voteResult);
  const { enterAgora } = useAgora();
  const { data } = useQuery({
    queryKey: ['agora', `${agoraId}`, 'closed'],
    queryFn: getVoteResult,
    enabled: enterAgora.status !== 'CLOSED',
  });

  return (
    <div className="text-sm">
      최종 투표 결과 |
      <span className="dark:text-dark-pro-color text-blue-400"> 찬성 </span>
      {data?.prosCount || result.prosCount || 0}
      <span className="dark:text-dark-con-color text-red-400 ml-10"> 반대 </span>
      {data?.consCount || result.consCount || 0}
    </div>
  );
}
