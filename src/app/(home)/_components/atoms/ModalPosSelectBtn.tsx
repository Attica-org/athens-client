import React from 'react';

type Position = 'con' | 'pro' | 'watcher';

type Props = {
  selectedPosition: string;
  position: Position;
  color: string;
  children: React.ReactNode;
  selectPosition: (position: Position) => void,
};

export default function ModalPosSelectBtn({
  selectedPosition,
  selectPosition,
  position,
  color,
  children,
}: Props) {
  const bgColor = position !== 'watcher' ? `bg-${color}-400` : 'bg-athens-main';
  return (
    <button
      type="button"
      onClick={() => selectPosition(position)}
      className={`p-5 mobile:pr-1rem mobile:pl-1rem pr-10 pl-10 ${
        selectedPosition === position
          ? `text-white ${bgColor}`
          : `text-${color}-400 bg-white dark:text-white dark:bg-dark-light-500`
      } rounded-xl mr-4 text-xs tablet:text-sm`}
    >
      {children}
    </button>
  );
}
