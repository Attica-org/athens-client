import React from 'react';
import { ParticipantPosition } from '@/app/model/Agora';
import { AGORA_POSITION } from '@/constants/agora';

type Props = {
  selectedPosition: ParticipantPosition;
  position: ParticipantPosition;
  color: string;
  children: React.ReactNode;
  selectPosition: (position: ParticipantPosition) => void;
};

export default function ModalPositionSelectBtn({
  selectedPosition,
  selectPosition,
  position,
  color,
  children,
}: Props) {
  const bgColor =
    position !== AGORA_POSITION.OBSERVER ? `bg-${color}-400` : 'bg-athens-main';
  return (
    <button
      type="button"
      onClick={() => selectPosition(position)}
      className={`p-5 mobile:pr-1rem mobile:pl-1rem pr-10 pl-10 ${
        selectedPosition === position
          ? `text-white ${bgColor} font-semibold`
          : `${color === 'athens-main' ? 'text-athens-main' : `text-${color}-400`} bg-white dark:text-white dark:bg-dark-light-600`
      } rounded-xl mr-4 text-xs tablet:text-sm`}
    >
      {children}
    </button>
  );
}
