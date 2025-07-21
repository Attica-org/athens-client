'use client';

import React, { ChangeEventHandler, useRef } from 'react';
import UserImage from '@/app/_components/atoms/UserImage';
import { useEnter } from '@/store/enter';
import { useShallow } from 'zustand/react/shallow';
import { AGORA_POSITION } from '@/constants/agora';

export default function SelectedProfile() {
  const { nickname, setNickname, profileImage, selectedPosition } = useEnter(
    useShallow((state) => ({
      selectedPosition: state.selectedPosition,
      nickname: state.nickname,
      setNickname: state.setNickname,
      profileImage: state.selectedProfileImage,
    })),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const nicknameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNickname(e.target.value);
  };

  inputRef.current?.focus();

  return (
    <div className="flex justify-start items-center mb-10">
      <UserImage
        className="w-65 h-65 bg-white"
        name={profileImage.name}
        file={profileImage.file}
        w={65}
        h={65}
      />
      <input
        disabled={selectedPosition === AGORA_POSITION.OBSERVER}
        ref={inputRef}
        aria-label="닉네임 입력창"
        type="text"
        value={nickname}
        placeholder={profileImage.name}
        onChange={nicknameChange}
        className="ml-10 text-sm dark:bg-dark-light-600 outline-none w-135 placeholder:text-sm p-5 rounded-md"
      />
    </div>
  );
}
