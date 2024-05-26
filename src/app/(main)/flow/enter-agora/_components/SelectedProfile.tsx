'use client';

import React, { ChangeEventHandler, useEffect, useRef } from 'react';
import UserImage from '@/app/_components/atoms/UserImage';
import { useEnter } from '@/store/enter';
import { useShallow } from 'zustand/react/shallow';

export default function SelectedProfile() {
  const {
    nickname, setNickname, profileImage, selectedPosition,
  } = useEnter(
    useShallow((state) => ({
      selectedPosition: state.selectedPosition,
      nickname: state.nickname,
      setNickname: state.setNickname,
      profileImage: state.selectedProfileImage,
    })),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const nicknameChange:ChangeEventHandler<HTMLInputElement> = (e) => {
    setNickname(e.target.value);
  };

  inputRef.current?.focus();

  useEffect(() => {
    const handleOutSideClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('click', handleOutSideClick);

    const cleanup = () => {
      window.removeEventListener('click', handleOutSideClick);
    };

    return cleanup;
  }, []);

  return (
    <div className="flex justify-start items-center mb-10">
      <UserImage className="w-65 h-65 bg-white" name={profileImage.name} file={profileImage.file} w={65} h={65} />
      <input disabled={selectedPosition === 'OBSERVERS'} ref={inputRef} aria-label="닉네임 입력창" type="text" value={nickname} placeholder={profileImage.name} onChange={nicknameChange} className="ml-12 text-sm dark:bg-dark-light-500 outline-none w-145 placeholder:text-sm p-3 rounded-md" />
    </div>
  );
}
