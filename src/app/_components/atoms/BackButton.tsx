'use client';

import BackIcon from '@/assets/icons/BackIcon';
import React from 'react';

export default function BackButton() {
  return (
    <button aria-label="뒤로가기" type="button">
      <BackIcon className="w-22 ml-1rem cursor-pointer" />
    </button>
  );
}
