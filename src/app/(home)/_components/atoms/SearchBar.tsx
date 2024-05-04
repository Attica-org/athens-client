'use client';

import RemoveIcon from '@/assets/icons/RemoveIcon';
import SearchIcon from '@/assets/icons/SearchIcon';
import React, { ChangeEventHandler, useState } from 'react';

export default function SearchBar() {
  const [inputText, setInputText] = useState<string>('');

  const removeInputText = () => {
    setInputText('');
  };

  const changeInputText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="bg-athens-gray rounded-md p-4 flex justify-center items-center dark:bg-dark-light-300">
      <SearchIcon className="w-22 ml-10" />
      <input
        aria-label="아고라 검색창"
        type="text"
        className="w-full text-sm bg-athens-gray border-0 focus:outline-none pl-1rem placeholder:font-normal placeholder:text-athens-gray-thick dark:bg-dark-light-300 dark:placeholder:text-white dark:placeholder:text-opacity-85 dark:text-white"
        placeholder="검색"
        value={inputText}
        onChange={changeInputText}
      />
      <div className="flex justify-center items-center w-1.5rem h-1.5rem">
        <RemoveIcon
          className="w-20 cursor-pointer"
          label="입력한 검색 텍스트 전체 삭제"
          onClick={removeInputText}
        />
      </div>
    </div>
  );
}
