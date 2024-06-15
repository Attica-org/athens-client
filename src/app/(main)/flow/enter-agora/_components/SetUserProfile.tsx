'use client';

import React, { useEffect } from 'react';
import UserImage from '@/app/_components/atoms/UserImage';
import PROFLELIST from '@/constants/userProfileImage';
import { useShallow } from 'zustand/react/shallow';
import { useEnter } from '@/store/enter';
import SelectedProfile from './SelectedProfile';

type ProfileImageName = {
  id: number;
  name: string;
  file: string;
};

export default function SetUserProfile() {
  const {
    setProfileImage, reset,
  } = useEnter(
    useShallow((state) => ({
      setProfileImage: state.setProfileImage,
      reset: state.reset,
    })),
  );

  const selectProfile = (profile: ProfileImageName):void => {
    setProfileImage(profile);
  };

  const handleKeyDownSetProfile = (
    e: React.KeyboardEvent<HTMLElement>,
    profile: ProfileImageName,
  ) => {
    if (e.key === 'Enter') {
      selectProfile(profile);
    }
  };

  useEffect(() => () => {
    reset();
  }, [reset]);

  return (
    <div className="flex flex-col justiy-start items-center">
      <SelectedProfile />
      <ul aria-label="사용할 프로필 이미지 선택" className="grid grid-cols-5 under-mobile:grid-cols-4 mobile:grid-cols-4 foldable:grid-cols-5 tablet:flex gap-y-5  pl-1rem">
        {PROFLELIST.map((profileImageName) => (
          <li
            key={profileImageName.id}
            className="cursor-pointer mr-5 w-fit flex justify-center items-center rounded-full"
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={profileImageName.name}
              onClick={() => selectProfile(profileImageName)}
              onKeyDown={(e) => handleKeyDownSetProfile(e, profileImageName)}
            >
              <UserImage className="rounded-full w-45 h-45 bg-white" file={profileImageName.file} name={profileImageName.name} w={45} h={45} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
