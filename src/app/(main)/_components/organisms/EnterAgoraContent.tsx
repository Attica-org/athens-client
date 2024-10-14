'use client';

import { useAgora } from '@/store/agora';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import Loading from '@/app/_components/atoms/loading';
import { usePathname } from 'next/navigation';
import { getSelectedAgoraQueryKey } from '@/constants/queryKey';
import { getAgoraTitle } from '../../_lib/getAgoraTitle';
import ModalPosSelectContainer from '../../flow/enter-agora/_components/ModalPosSelectContainer';
import InputErrorMessage from '../../flow/enter-agora/_components/InputErrorMessage';
import SetUserProfile from '../../flow/enter-agora/_components/SetUserProfile';
import EnterAgoraButton from '../../flow/enter-agora/_components/EnterAgoraButton';

export default function EnterAgoraContent() {
  const { selectedAgora, setSelectedAgora } = useAgora();
  const pathname = usePathname();
  const agoraId = pathname.split('/')[3];

  const shouldFetch = !!agoraId && !selectedAgora.id;

  const { data, isSuccess } = useQuery({
    queryKey: getSelectedAgoraQueryKey(agoraId),
    queryFn: getAgoraTitle,
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (isSuccess && data && !selectedAgora.id) {
      setSelectedAgora({
        id: Number(agoraId),
        thumbnail: '',
        title: data.title,
        status: data.status,
        agoraColor: 'bg-agora-point-color1',
      });
    }
  }, [agoraId, data, setSelectedAgora, isSuccess, selectedAgora.id]);

  return (
    <>
      {selectedAgora.title ? (
        <p className="text-base p-1rem pt-5 flex justify-center items-center text-center break-keep font-medium">
          {selectedAgora.title}
        </p>
      ) : (
        <div className="mb-1rem flex justify-center items-center">
          <p className="mr-8">불러오는 중...</p>
          <Loading
            w="16"
            h="16"
            className="m-2 flex justify-center items-center"
          />
        </div>
      )}
      <ModalPosSelectContainer />
      <InputErrorMessage />
      <SetUserProfile />
      <EnterAgoraButton />
    </>
  );
}
