'use client';

import { useAgora } from '@/store/agora';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import Loading from '@/app/_components/atoms/loading';
import { usePathname, useRouter } from 'next/navigation';
import { getSelectedAgoraQueryKey } from '@/constants/queryKey';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useShallow } from 'zustand/react/shallow';
import { getAgoraTitle } from '../../_lib/getAgoraTitle';
import ModalPosSelectContainer from '../../flow/enter-agora/_components/ModalPosSelectContainer';
import InputErrorMessage from '../../flow/enter-agora/_components/InputErrorMessage';
import SetUserProfile from '../../flow/enter-agora/_components/SetUserProfile';
import EnterAgoraButton from '../../flow/enter-agora/_components/EnterAgoraButton';

export default function EnterAgoraContent() {
  const { selectedAgora, setSelectedAgora } = useAgora(
    useShallow((state) => ({
      selectedAgora: state.selectedAgora,
      setSelectedAgora: state.setSelectedAgora,
    })),
  );

  const router = useRouter();
  const pathname = usePathname();
  const agoraId = pathname.split('/')[3];
  const shouldFetch = !!agoraId && !selectedAgora.id;

  const { data, isSuccess, isError } = useQuery({
    queryKey: getSelectedAgoraQueryKey(agoraId),
    queryFn: getAgoraTitle,
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (isSuccess && data && !selectedAgora.id) {
      setSelectedAgora({
        id: Number(agoraId),
        imageUrl: data.imageUrl,
        agoraTitle: data.title,
        status: data.status,
        agoraColor: data.agoraColor,
      });
    } else if (!isSuccess && isError) {
      // showToast('아고라 제목을 불러오는데 실패했습니다.', 'error');
      router.push(`${homeSegmentKey}?status=active`);
    }
  }, [
    agoraId,
    data,
    isError,
    isSuccess,
    router,
    selectedAgora.id,
    setSelectedAgora,
  ]);

  return (
    <>
      {selectedAgora.agoraTitle ? (
        <p
          id="description"
          className="text-base p-1rem pt-5 flex justify-center items-center text-center break-keep font-medium"
        >
          {selectedAgora.agoraTitle}
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
