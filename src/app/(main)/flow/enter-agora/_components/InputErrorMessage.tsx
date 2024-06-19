'use client';

import { useEnter } from '@/store/enter';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function InputErrorMessage() {
  const { message } = useEnter(useShallow((state) => ({ message: state.message })));

  return (
    <div>
      { message && (
        <div role="alert" aria-live="polite" className="mb-16 dark:text-dark-con-color text-red-400 text-xs lg:text-sm w-full flex justify-center items-center">
          {`${message}`}
        </div>
      )}
    </div>
  );
}
