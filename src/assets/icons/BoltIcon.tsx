import React from 'react';

type Props = {
  className: string;
  fill: string;
};

export default function BoltIcon({ className, fill }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
      fill={fill}
    >
      <path d="m320-80 40-280H160l360-520h80l-40 320h240L400-80h-80Z" />
    </svg>
  );
}
