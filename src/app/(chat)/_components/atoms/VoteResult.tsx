'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useAgora } from '@/store/agora';
import { useVoteStore } from '@/store/vote';
import showToast from '@/utils/showToast';
import { getVoteResultQueryKey } from '@/constants/queryKey';
import { getVoteResult } from '../../_lib/getVoteResult';

type Props = {
  agoraId: number;
};

export default function VoteResult({ agoraId }: Props) {
  const result = useVoteStore((state) => state.voteResult);
  const { enterAgora } = useAgora();
  const { data, refetch, error } = useQuery({
    queryKey: getVoteResultQueryKey(agoraId),
    queryFn: getVoteResult,
    retry: 2,
  });

  useEffect(() => {
    if (enterAgora.status === 'CLOSED') {
      refetch();
    }
  }, [enterAgora.status, refetch]);

  useEffect(() => {
    if (!data && error) {
      showToast('투표 결과를 가져오는데 실패했습니다.', 'error');
    }
  }, [data, error]);

  return (
    <div className="text-xs lg:text-sm">
      최종 투표 결과 |
      <span className="dark:text-dark-pro-color text-blue-400"> 찬성 </span>
      {result.prosCount || data?.prosCount || 0}
      <span className="dark:text-dark-con-color text-red-400 ml-7"> 반대 </span>
      {result.consCount || data?.consCount || 0}
    </div>
  );
}
