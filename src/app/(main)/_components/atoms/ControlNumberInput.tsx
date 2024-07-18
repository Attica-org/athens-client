import { ParticipantCountAction } from '@/app/model/Agora';
import React from 'react';

type Props = {
  label: string;
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: (action: ParticipantCountAction) => void;
  increaseLabel: string;
  decreaseLabel: string;
  inputLabel: string;
};

export default function ModifyNumberInput({
  label,
  value,
  handleChange,
  handleButtonClick,
  increaseLabel,
  decreaseLabel,
  inputLabel,
}: Props) {
  return (
    <label
      htmlFor="modify-number-input"
      className="lg:text-sm text-xs flex justify-center items-center"
    >
      {label}
      <div className="ml-0.5rem pl-7 pr-7 border-1 border-athens-gray rounded-md dark:border-gray-500 flex justify-center items-center">
        <button
          type="button"
          aria-label={decreaseLabel}
          className="text-xl cursor-pointer"
          onClick={() => handleButtonClick('DECREASE')}
        >
          -
        </button>
        <input
          id="modify-number-input"
          aria-label={inputLabel}
          value={value}
          onChange={handleChange}
          type="number"
          className="text-center max-w-32 w-32 text-xs input-number-hide focus-visible:outline-none dark:bg-dark-bg-light"
        />
        <button
          type="button"
          aria-label={increaseLabel}
          className="text-xl cursor-pointer"
          onClick={() => handleButtonClick('INCREASE')}
        >
          +
        </button>
      </div>
    </label>
  );
}
