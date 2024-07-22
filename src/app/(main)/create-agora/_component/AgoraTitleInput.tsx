'use client';

import { useCreateAgora } from '@/store/create';
import React, { ChangeEventHandler, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

function AgoraTitleInput() {
  const [message, setMessage] = useState<string | null>('주제를 입력해주세요.');
  const { title, setTitle } = useCreateAgora(
    useShallow((state) => ({
      title: state.title,
      setTitle: state.setTitle,
    })),
  );

  const changeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value);

    if (e.target.value.trim().length === 0) {
      setMessage('주제를 입력해주세요.');
    } else if (e.target.value.length > 15) {
      setMessage('주제는 15자 이내로 입력해주세요.');
    } else {
      setMessage(null);
    }
  };

  return (
    <>
      <input
        aria-label="생성할 아고라 주제 입력창"
        type="text"
        value={title}
        onChange={changeInput}
        placeholder="토론 할 주제를 입력해주세요."
        className="placeholder:text-athens-gray-thick w-full p-0.5rem text-sm border-1 border-gray-300 rounded-md dark:bg-dark-light-300 dark:placeholder:text-white dark:placeholder:text-opacity-85 dark:border-0 dark:text-white"
      />
      {message && (
        <div
          aria-live="polite"
          role="alert"
          className="text-xs text-red-600 p-5 pl-0 dark:text-dark-con-color"
        >
          {message}
        </div>
      )}
    </>
  );
}

export default AgoraTitleInput;
