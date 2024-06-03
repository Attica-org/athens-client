import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useAgora } from '@/store/agora';
import { getVoteResult } from '../../_lib/getVoteResult';

type Props = {
  agoraId: number;
};

export default function VoteResult({ agoraId }: Props) {
  const { enterAgora } = useAgora();
  const { data } = useQuery({
    queryKey: ['agora', `${agoraId}`, 'closed'],
    queryFn: getVoteResult,
    enabled: enterAgora.status !== 'closed',
  });

  return (
    { data } && (
    <div className="text-sm">
      최종 투표 결과 |
      <span className="dark:text-dark-pro-color text-blue-400"> 찬성 </span>
      {data?.prosCount}
      <span className="dark:text-dark-con-color text-red-400"> 반대 </span>
      {data?.consCount}
    </div>
    )
  );
}
