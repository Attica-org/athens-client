'use client';

import { useAgora } from '@/store/agora';
import tokenManager from '@/utils/tokenManager';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import Loading from '@/app/_components/atoms/loading';
import { getAgoraTitle } from '../../_lib/getAgoraTitle';
import ModalPosSelectContainer from '../../flow/enter-agora/_components/ModalPosSelectContainer';
import InputErrorMessage from '../../flow/enter-agora/_components/InputErrorMessage';
import SetUserProfile from '../../flow/enter-agora/_components/SetUserProfile';
import EnterAgoraButton from '../../flow/enter-agora/_components/EnterAgoraButton';

export default function EnterAgoraContent() {
  const { selectedAgora, setSelectedAgora } = useAgora();
  const redirectUrl: string | null = tokenManager.getRedirectUrl();
  const agoraId = redirectUrl?.split('/').pop() as string;

  const { data, isSuccess } = useQuery({
    queryKey: ['agoraTitle', agoraId],
    queryFn: getAgoraTitle,
    enabled: !selectedAgora.id && agoraId !== '-1',
  });

  useEffect(() => {
    if (isSuccess) {
      setSelectedAgora({ id: Number(agoraId), title: data.title, status: data.status });
      tokenManager.clearRedirectUrl();
    }
  }, [agoraId, data, setSelectedAgora, isSuccess]);

  return (
    <>
      {selectedAgora.title
        ? (<p className="text-base p-1rem pt-5 flex justify-center items-center text-center break-keep font-medium">{selectedAgora.title}</p>)
        : (
          <div className="mb-1rem flex justify-center items-center">
            <p className="mr-8">
              불러오는 중...
            </p>
            <Loading w="16" h="16" />
          </div>
        )}
      <ModalPosSelectContainer />
      <InputErrorMessage />
      <SetUserProfile />
      <EnterAgoraButton />
    </>
  );
}
