import React from 'react';

type Props = {
  innerText: string;
  isActive: boolean;
};

export default function CategoryButton({ innerText, isActive }: Props) {
  return (
    <div
      className={`${
        isActive ? 'bg-athens-sub text-black border-1 border-athens-sub' : 'bg-athens-gray dark:bg-dark-bg-light dark:text-white border-1 border-athens-gray dark:border-1 dark:border-gray-500'
      } flex justify-center p-8 pl-1.5rem pr-1.5rem rounded-full text-xs mr-7`}
    >
      {innerText}
    </div>
  );
}
