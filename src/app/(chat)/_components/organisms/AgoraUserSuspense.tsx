'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgoraUserProfileType } from '@/app/model/Agora';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import { useChatInfo } from '@/store/chatInfo';
import { useShallow } from 'zustand/react/shallow';
import { getAgoraUserListQueryKey } from '@/constants/queryKey';
import { useAgora } from '@/store/agora';
import AgoraUserList from '../molecules/AgoraUserList';
import { getAgoraUsers } from '../../_lib/getAgoraUsers';

const errorFallbackProps = {
  headerLabel: '참여자 목록 오류',
  btnLabel: '다시 불러오기',
};

type Props = {
  agoraId: number;
};

function FallbackComponent(props: FallbackProps) {
  return <ErrorFallback {...props} {...errorFallbackProps} />;
}

export default function AgoraUserSuspense({ agoraId }: Props) {
  const { enterAgora } = useAgora();
  const { end } = useChatInfo(
    useShallow((state) => ({
      end: state.end,
    })),
  );

  const { data: userList } = useQuery<
    AgoraUserProfileType[],
    Object,
    AgoraUserProfileType[],
    [string, string, string]
  >({
    queryKey: getAgoraUserListQueryKey(agoraId),
    queryFn: getAgoraUsers,
    staleTime: 1000 * 30,
    gcTime: 60 * 1000,
    enabled: enterAgora.status !== 'CLOSED' && !end,
  });

  return (
    <div>
      {userList && !end && (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <AgoraUserList position="PROS" userList={userList} />
          <div className="border-b-1 border-gray-200 mb-1rem dark:border-gray-500" />
          <AgoraUserList position="CONS" userList={userList} />
        </ErrorBoundary>
      )}
    </div>
  );
}
