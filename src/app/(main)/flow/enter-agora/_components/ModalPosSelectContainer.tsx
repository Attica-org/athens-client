'use client';

import React from 'react';
import ModalPosSelectBtn from '@/app/(main)/_components/atoms/ModalPosSelectBtn';
import { useEnter } from '@/store/enter';
import { useShallow } from 'zustand/react/shallow';

type Position = 'cons' | 'pros' | 'observers';

export default function ModalPosSelectContainer() {
  const { selectedPosition, setSelectedPosition } = useEnter(
    useShallow((state) => ({
      selectedPosition: state.selectedPosition,
      setSelectedPosition: state.setSelectedPosition,
    })),
  );

  const selectPosition = (position: Position) => {
    setSelectedPosition(position);
  };

  return (
    <div className="mt-2rem flex justify-center items-center text-sm under-mobile:text-xs min-w-200">
      <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="pros" color="blue">
        찬성
      </ModalPosSelectBtn>
      <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="cons" color="red">
        반대
      </ModalPosSelectBtn>
      <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="observers" color="athens-main">
        관찰자
      </ModalPosSelectBtn>
      <span className="pl-6 text-xs">로 입장</span>
    </div>
  );
}
