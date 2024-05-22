'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgoraUser } from '@/app/model/AgoraUser';
import AgoraUserList from '../molecules/AgoraUserList';
import { getAgoraUsers } from '../../_lib/getAgoraUsers';

type Props = {
  agoraId: string;
};

export default function AgoraUserSuspense({ agoraId }: Props) {
  const { data: userList } = useQuery<AgoraUser[], Object, AgoraUser[], [string, string, string]>({
    queryKey: ['chat', 'users', agoraId as string],
    queryFn: getAgoraUsers,
    staleTime: 1000 * 30,
    gcTime: 60 * 1000,
  });
  return (
    <div>
      { userList && (
        <>
          <AgoraUserList position="PROS" userList={userList} />
          <div className="border-b-1 border-gray-200 mb-1rem dark:border-gray-500" />
          <AgoraUserList position="CONS" userList={userList} />
        </>
      )}
    </div>
  );
}
