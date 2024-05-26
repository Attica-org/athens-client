'use client';

import React from 'react';
import { useAgora } from '@/store/agora';
import ModalBase from '../../../_components/molecules/ModalBase';
import ModalPosSelectContainer from '../../flow/enter-agora/_components/ModalPosSelectContainer';
import SetUserProfile from '../../flow/enter-agora/_components/SetUserProfile';
import EnterAgoraButton from '../../flow/enter-agora/_components/EnterAgoraButton';
import InputErrorMessage from '../../flow/enter-agora/_components/InputErrorMessage';

export default function EnterAgora() {
  const { selectedAgora } = useAgora();

  return (
    <ModalBase title="아고라 입장" removeIcon animation={false}>
      <p className="text-base p-1rem flex justify-center items-cener text-center break-keep font-medium">
        {selectedAgora.title}
      </p>
      <ModalPosSelectContainer />
      <InputErrorMessage />
      <SetUserProfile />
      <EnterAgoraButton />
    </ModalBase>
  );
}
