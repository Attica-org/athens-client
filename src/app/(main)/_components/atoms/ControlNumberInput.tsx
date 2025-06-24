import { ParticipantCountAction } from '@/app/model/Agora';
import React from 'react';

type Props = {
  label: string;
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleControlButtonClick: (action: ParticipantCountAction) => void;
  controlLabel: {
    increase: string;
    decrease: string;
  };
  inputAriaLabel: string;
  range: {
    max: number;
    min: number;
  };
};

export default function ControlNumberInput({
  label,
  value,
  handleChange,
  handleControlButtonClick,
  controlLabel,
  inputAriaLabel,
  range,
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
          aria-label={controlLabel.decrease}
          className="text-xl cursor-pointer"
          onClick={() =>
            handleControlButtonClick(ParticipantCountAction.DECREASE)
          }
        >
          -
        </button>
        <input
          id="modify-number-input"
          aria-label={inputAriaLabel}
          min={range.min}
          max={range.max}
          value={value}
          onChange={handleChange}
          type="number"
          className="text-center max-w-32 w-32 text-xs input-number-hide focus-visible:outline-none dark:bg-dark-bg-light"
        />
        <button
          type="button"
          aria-label={controlLabel.increase}
          className="text-xl cursor-pointer"
          onClick={() =>
            handleControlButtonClick(ParticipantCountAction.INCREASE)
          }
        >
          +
        </button>
      </div>
    </label>
  );
}
