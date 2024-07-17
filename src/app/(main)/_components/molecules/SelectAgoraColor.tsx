'use client';

import React, { useState } from 'react';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import COLOR from '@/constants/agoraColor';
import AgoraPointColor from '../atoms/AgoraPointColor';

export default function SelectAgoraColor() {
  const [isCheck, setIsCheck] = useState<number>(0);
  const { setColor } = useCreateAgora(
    useShallow((state) => ({ setColor: state.setColor })),
  );

  const selectColor = (id: number) => {
    setIsCheck(id);
    setColor(COLOR[id].value);
  };

  return (
    <div className="flex justify-start items-center">
      {Array.from({ length: COLOR.length }, (_, i) => (
        <button
          type="button"
          aria-label={`${COLOR[i].label}`}
          key={i}
          onClick={() => selectColor(i)}
        >
          <AgoraPointColor
            key={i}
            isCheck={isCheck === i}
            color={COLOR[i].value}
          />
        </button>
      ))}
    </div>
  );
}
