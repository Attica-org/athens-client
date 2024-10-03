'use client';

import React, { useEffect, useState } from 'react';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import COLOR from '@/constants/agoraColor';
import AgoraPointColor from '../atoms/AgoraPointColor';

export default function SelectAgoraColor() {
  const { setColor, color } = useCreateAgora(
    useShallow((state) => ({
      setColor: state.setColor,
      color: state.color,
    })),
  );
  const [isCheck, setIsCheck] = useState<number>(color.idx);

  const selectColor = (id: number) => {
    setIsCheck(id);
    setColor(COLOR[id].value, id);
  };

  useEffect(() => {
    setIsCheck(color.idx);
  }, [color.idx]);

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
