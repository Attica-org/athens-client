'use client';

import React, { useEffect } from 'react';
import ModalPosSelectBtn from '@/app/(main)/_components/atoms/ModalPositionSelectBtn';
import { useEnter } from '@/store/enter';
import { useShallow } from 'zustand/react/shallow';
import { ParticipationPosition } from '@/app/model/Agora';
import { AGORA_POSITION } from '@/constants/agora';

export default function ModalPosSelectContainer() {
  const { selectedPosition, setSelectedPosition, setMessage } = useEnter(
    useShallow((state) => ({
      setMessage: state.setMessage,
      selectedPosition: state.selectedPosition,
      setSelectedPosition: state.setSelectedPosition,
    })),
  );

  useEffect(() => {
    if (selectedPosition === AGORA_POSITION.OBSERVER) {
      setMessage('관찰자는 프로필을 설정할 수 없습니다.');
    } else if (
      selectedPosition === AGORA_POSITION.CONS ||
      selectedPosition === AGORA_POSITION.PROS
    ) {
      setMessage('');
    }
  }, [selectedPosition, setMessage]);

  const selectPosition = (position: ParticipationPosition) => {
    setSelectedPosition(position);
  };

  return (
    <div className="mb-15 mt-8 flex justify-center items-center text-sm under-mobile:text-xs min-w-200">
      <ModalPosSelectBtn
        selectedPosition={selectedPosition}
        selectPosition={selectPosition}
        position={AGORA_POSITION.PROS}
        color="blue"
      >
        찬성
      </ModalPosSelectBtn>
      <ModalPosSelectBtn
        selectedPosition={selectedPosition}
        selectPosition={selectPosition}
        position={AGORA_POSITION.CONS}
        color="red"
      >
        반대
      </ModalPosSelectBtn>
      <ModalPosSelectBtn
        selectedPosition={selectedPosition}
        selectPosition={selectPosition}
        position={AGORA_POSITION.OBSERVER}
        color="athens-main"
      >
        관찰자
      </ModalPosSelectBtn>
      <span className="pl-6 text-xs">로 입장</span>
    </div>
  );
}
