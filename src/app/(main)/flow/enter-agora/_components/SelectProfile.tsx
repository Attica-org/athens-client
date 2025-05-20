'use client';

import React from 'react';
import UserImage from '@/app/_components/atoms/UserImage';
import { PROFLELIST } from '@/constants/consts';
import { useShallow } from 'zustand/react/shallow';
import { useEnter } from '@/store/enter';
import { ProfileImage } from '@/app/model/Agora';
import { AGORA_POSITION } from '@/constants/agora';

export default function SelectProfile() {
  const { setProfileImage, selectedPosition } = useEnter(
    useShallow((state) => ({
      setProfileImage: state.setProfileImage,
      selectedPosition: state.selectedPosition,
    })),
  );

  const selectProfile = (profile: ProfileImage): void => {
    setProfileImage(profile);
  };

  const handleKeyDownSetProfile = (
    e: React.KeyboardEvent<HTMLElement>,
    profile: ProfileImage,
  ) => {
    if (e.key === 'Enter') {
      selectProfile(profile);
    }
  };

  return (
    <ul
      aria-label="사용할 프로필 이미지 선택"
      className="grid grid-cols-5 under-mobile:grid-cols-4 mobile:grid-cols-4 foldable:grid-cols-5 tablet:flex gap-y-5  pl-1rem"
    >
      {PROFLELIST.map((profileImageName) => {
        const isDisabled = selectedPosition === AGORA_POSITION.OBSERVER;

        return (
          <li
            key={profileImageName.id}
            className="cursor-pointer mr-5 w-fit flex justify-center items-center rounded-full"
          >
            <button
              type="button"
              disabled={isDisabled}
              aria-label={profileImageName.name}
              onClick={() => selectProfile(profileImageName)}
              onKeyDown={(e) => handleKeyDownSetProfile(e, profileImageName)}
            >
              <UserImage
                className="rounded-full w-45 h-45 bg-white"
                file={profileImageName.file}
                name={profileImageName.name}
                w={45}
                h={45}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
