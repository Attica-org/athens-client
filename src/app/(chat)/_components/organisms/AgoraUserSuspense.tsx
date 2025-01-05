'use client';

import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgoraUserProfileType } from '@/app/model/Agora';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import { useChatInfo } from '@/store/chatInfo';
import { useShallow } from 'zustand/react/shallow';
import { getAgoraUserListQueryKey } from '@/constants/queryKey';
import { useAgora } from '@/store/agora';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import isNull from '@/utils/validation/validateIsNull';
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
  const { end, addParticipant } = useChatInfo(
    useShallow((state) => ({
      end: state.end,
      addParticipant: state.addParticipant,
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
    enabled: enterAgora.status !== AGORA_STATUS.CLOSED && !end,
  });

  const subscribeCount = useRef<number>(1);

  const decrementSubscribeCount = () => {
    subscribeCount.current -= 1;
  };

  useEffect(() => {
    if (isNull(userList)) return;
    userList.forEach((user) => {
      const { id, nickname } = user;

      if (isNull(nickname)) return;

      addParticipant(id, nickname);
    });
  }, [userList]);

  useEffect(() => {
    return () => {
      subscribeCount.current = 1;
    };
  }, []);

  return (
    <div>
      {userList && !end && (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <AgoraUserList
            position={AGORA_POSITION.PROS}
            userList={userList}
            subscribeCount={subscribeCount}
            decrementSubscribeCount={decrementSubscribeCount}
          />
          <div className="border-b-1 border-gray-200 mb-1rem dark:border-gray-500" />
          <AgoraUserList
            position={AGORA_POSITION.CONS}
            userList={userList}
            subscribeCount={subscribeCount}
            decrementSubscribeCount={decrementSubscribeCount}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
