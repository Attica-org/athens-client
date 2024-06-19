'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgoraUser } from '@/app/model/AgoraUser';
import AgoraUserList from '../molecules/AgoraUserList';
import { getAgoraUsers } from '../../_lib/getAgoraUsers';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';

const errorFallbackProps = {
  headerLabel: '참여자 목록 오류',
  btnLabel: '다시 불러오기',
}

type Props = {
  agoraId: number;
};

export default function AgoraUserSuspense({ agoraId }: Props) {
  const { data: userList } = useQuery<AgoraUser[], Object, AgoraUser[], [string, string, string]>({
    queryKey: ['chat', 'users', `${agoraId}`],
    queryFn: getAgoraUsers,
    staleTime: 1000 * 30,
    gcTime: 60 * 1000,
  });
  return (
    <div>
      { userList && (
        <ErrorBoundary FallbackComponent={(props) => <ErrorFallback {...props} {...errorFallbackProps}/>}>
          <AgoraUserList position="PROS" userList={userList} />
          <div className="border-b-1 border-gray-200 mb-1rem dark:border-gray-500" />
          <AgoraUserList position="CONS" userList={userList} />
        </ErrorBoundary>
      )}
    </div>
  );
}
