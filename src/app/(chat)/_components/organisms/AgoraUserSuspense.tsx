'use client';

import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgoraId, AgoraSideBarDataType, ImageURL } from '@/app/model/Agora';
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
  agoraId: AgoraId;
};

function FallbackComponent(props: FallbackProps) {
  return <ErrorFallback {...props} {...errorFallbackProps} />;
}

export default function AgoraUserSuspense({ agoraId }: Props) {
  const { enterAgora, selectedAgora, setSelectedAgora, setEnterAgora } =
    useAgora();
  const { end, addParticipant, resetParticipants } = useChatInfo(
    useShallow((state) => ({
      end: state.end,
      addParticipant: state.addParticipant,
      resetParticipants: state.resetParticipants,
    })),
  );

  const { data } = useQuery<
    AgoraSideBarDataType,
    Object,
    AgoraSideBarDataType,
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

  const updateAgoraThumnail = (imageUrl: ImageURL) => {
    setEnterAgora({
      ...enterAgora,
      imageUrl,
    });

    setSelectedAgora({
      ...selectedAgora,
      imageUrl,
    });
  };

  useEffect(() => {
    if (isNull(data)) return;

    updateAgoraThumnail(data.agoraThumbnailUrl ?? '');
    resetParticipants();

    data.participants.forEach((user) => {
      const { id, nickname } = user;

      if (isNull(nickname)) return;

      addParticipant(id, nickname);
    });
  }, [data]);

  useEffect(() => {
    return () => {
      subscribeCount.current = 1;
    };
  }, []);

  return (
    <div>
      {data?.participants && !end && (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <AgoraUserList
            position={AGORA_POSITION.PROS}
            userList={data.participants}
            subscribeCount={subscribeCount}
            decrementSubscribeCount={decrementSubscribeCount}
          />
          <div className="border-b-1 border-gray-200 mb-1rem dark:border-gray-500" />
          <AgoraUserList
            position={AGORA_POSITION.CONS}
            userList={data.participants}
            subscribeCount={subscribeCount}
            decrementSubscribeCount={decrementSubscribeCount}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
