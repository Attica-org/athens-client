import React, { Suspense } from 'react';
import Loading from '@/app/_components/atoms/loading';
import ModalBase from '../../../_components/molecules/ModalBase';
import EnterAgoraContent from '../organisms/EnterAgoraContent';

export default function EnterAgora() {
  return (
    <ModalBase title="아고라 입장" removeIcon animation={false}>
      <Suspense
        fallback={<Loading className="m-2 flex justify-center items-center" />}
      >
        <EnterAgoraContent />
      </Suspense>
    </ModalBase>
  );
}
