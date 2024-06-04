'use client';

import React, { useEffect } from 'react';
import ModalPosSelectBtn from '@/app/(main)/_components/atoms/ModalPosSelectBtn';
import { useEnter } from '@/store/enter';
import { useShallow } from 'zustand/react/shallow';

type Position = 'CONS' | 'PROS' | 'OBSERVER';

export default function ModalPosSelectContainer() {
  const {
    selectedPosition, setSelectedPosition, setMessage,
  } = useEnter(
    useShallow((state) => ({
      setMessage: state.setMessage,
      selectedPosition: state.selectedPosition,
      setSelectedPosition: state.setSelectedPosition,
    })),
  );

  useEffect(() => {
    if (selectedPosition === 'OBSERVER') {
      setMessage('관찰자는 프로필을 설정할 수 없습니다.');
    } else if (selectedPosition === 'CONS' || selectedPosition === 'PROS') {
      setMessage('');
    }
  }, [selectedPosition, setMessage]);

  const selectPosition = (position: Position) => {
    setSelectedPosition(position);
  };

  return (
    <div className="mb-15 mt-8 flex justify-center items-center text-sm under-mobile:text-xs min-w-200">
      <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="PROS" color="blue">
        찬성
      </ModalPosSelectBtn>
      <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="CONS" color="red">
        반대
      </ModalPosSelectBtn>
      <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="OBSERVER" color="athens-main">
        관찰자
      </ModalPosSelectBtn>
      <span className="pl-6 text-xs">로 입장</span>
    </div>
  );
}
