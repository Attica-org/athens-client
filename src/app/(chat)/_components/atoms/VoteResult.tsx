'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useAgora } from '@/store/agora';
import { useVoteStore } from '@/store/vote';
import { getVoteResult } from '../../_lib/getVoteResult';

type Props = {
  agoraId: number;
};

export default function VoteResult({ agoraId }: Props) {
  const result = useVoteStore((state) => state.voteResult);
  const { enterAgora } = useAgora();
  const { data, refetch } = useQuery({
    queryKey: ['agora', `${agoraId}`, 'closed'],
    queryFn: getVoteResult,
  });

  useEffect(() => {
    if (enterAgora.status === 'CLOSED') {
      refetch();
    }
  }, [enterAgora.status, refetch]);

  return (
    <div className="text-sm">
      최종 투표 결과 |
      <span className="dark:text-dark-pro-color text-blue-400"> 찬성 </span>
      { result.prosCount || data?.prosCount || 0}
      <span className="dark:text-dark-con-color text-red-400 ml-10"> 반대 </span>
      {result.consCount || data?.consCount || 0}
    </div>
  );
}
