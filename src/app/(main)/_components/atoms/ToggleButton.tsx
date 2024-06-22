'use client';

import React, { useState } from 'react';

export default function ToggleButton() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <button
      type="button"
      aria-label="다크모드 토글 버튼"
      className="cursor-pointer w-full"
      onClick={handleToggle}
    >
      <div
        className={`relative w-50 h-24 rounded-xl border-1 border-gray-300 bg-opacity-75 transition-opaticy duration-500 ${
          isOn ? 'bg-black' : 'bg-slate-100'
        }`}
      >
        <div className={`${isOn && 'bg-black bg-opacity-75'} `}>
          <div
            className={`absolute top-3 left-8 ease-in-out w-16 h-16 rounded-full bg-black duration-500 flex-1 transition ${
              isOn ? 'bg-white translate-x-full' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </button>
  );
}
