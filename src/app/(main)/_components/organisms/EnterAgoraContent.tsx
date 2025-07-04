'use client';

import { useAgora } from '@/store/agora';
import React, { useEffect } from 'react';
import Loading from '@/app/_components/atoms/loading';
import { usePathname, useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useEnterAgoraSetInfo } from '@/hooks/useEnterAgoraSetInfo';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useErrorStore } from '@/store/error';
import { AccessStatus } from '@/app/model/AccessStatus';
import ModalPosSelectContainer from '../../flow/enter-agora/_components/ModalPosSelectContainer';
import InputErrorMessage from '../../flow/enter-agora/_components/InputErrorMessage';
import SetUserProfile from '../../flow/enter-agora/_components/SetUserProfile';
import EnterAgoraButton from '../../flow/enter-agora/_components/EnterAgoraButton';

export default function EnterAgoraContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedAgora } = useAgora(
    useShallow((state) => ({
      selectedAgora: state.selectedAgora,
    })),
  );
  const { setErrorType } = useErrorStore(
    useShallow((state) => ({
      setErrorType: state.setErrorType,
    })),
  );

  const agoraId = Number(pathname.split('/')[3]);
  const enabled = !!agoraId && selectedAgora.id === -1;

  const { isSuccess, isError } = useEnterAgoraSetInfo({
    enabled,
    agoraId,
    selectedAgoraId: selectedAgora.id,
  });

  useEffect(() => {
    if (!enabled) {
      setErrorType(AccessStatus.ENTER);
      router.replace(`${homeSegmentKey}?status=active`);
    }
    if (!isSuccess && isError) {
      router.replace(`${homeSegmentKey}?status=active`);
    }
  }, [enabled, isSuccess, isError, router]);

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
