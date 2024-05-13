'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PROFLELIST from '@/constants/userProfileImage';
import UserImage from '@/app/_components/atoms/UserImage';
import { useMutation } from '@tanstack/react-query';
import { useAgora } from '@/store/agora';
import ModalPosSelectBtn from '../atoms/ModalPosSelectBtn';
import ModalBase from '../../../_components/molecules/ModalBase';
import { postEnterAgoraInfo } from '../../_api/postEnterAgoraInfo';
import Loading from '../../loading';

type ProfileImageName = {
  id: number;
  name: string;
};

type Position = 'con' | 'pro' | 'observer';

export default function EnterAgora() {
  const [selectedProfileImage, setSelectedProfileImage] = useState<ProfileImageName>({ id: 1, name: '도끼 든 회색 곰' });
  const [selectedPosition, setSelectedPosition] = useState<Position>('observer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { selectedAgora } = useAgora();

  const mutation = useMutation({
    mutationFn: async () => {
      const info = {
        ...selectedProfileImage,
        role: selectedPosition,
      };
      return postEnterAgoraInfo({ info, agoraId: selectedAgora.id });
    },
    onSuccess: async () => {
      router.push(`/agora/${selectedAgora.id}`);
      setIsLoading(false);
    },
    onError: (error) => {
      console.dir(error);
      alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const selectProfile = (profile: ProfileImageName):void => {
    setSelectedProfileImage(profile);
  };

  const selectPosition = (position: Position) => {
    setSelectedPosition(position);
  };

  const enterAgora = () => {
    setIsLoading(true);
    mutation.mutate();
  };

  const handleKeyDownSetProfile = (
    e: React.KeyboardEvent<HTMLElement>,
    profile: ProfileImageName,
  ) => {
    if (e.key === 'Enter') {
      selectProfile(profile);
    }
  };

  return (
    <ModalBase title="아고라 입장" removeIcon animation={false}>
      <p className="text-base p-1rem pt-0.5rem pb-1.5rem flex justify-center items-cener text-center break-keep font-medium">
        {selectedAgora.title}
      </p>
      <div className="flex flex-col justiy-start items-center">
        <div className="flex justify-start items-center mb-10">
          <UserImage className="w-65 h-65 bg-white" name={selectedProfileImage.name} w={65} h={65} />
          <div aria-hidden className="text-sm p-0.5rem w-fit ml-12">
            {selectedProfileImage.name}
          </div>
        </div>
        <ul aria-label="사용할 프로필 이미지 선택" className="grid grid-cols-5 under-mobile:grid-cols-4 mobile:grid-cols-4 foldable:grid-cols-5 gap-y-5  pl-1rem">
          {PROFLELIST.map((profileImageName) => (
            <li
              key={profileImageName.id}
              className="cursor-pointer mr-5 w-fit flex justify-center items-center border-1 border-gray-300 rounded-full"
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={profileImageName.name}
                onClick={() => selectProfile(profileImageName)}
                onKeyDown={(e) => handleKeyDownSetProfile(e, profileImageName)}
              >
                <UserImage className="rounded-full w-45 h-45 bg-white" name={profileImageName.name} w={45} h={45} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2rem flex justify-center items-center text-sm under-mobile:text-xs min-w-200">
        <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="pro" color="blue">
          찬성
        </ModalPosSelectBtn>
        <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="con" color="red">
          반대
        </ModalPosSelectBtn>
        <ModalPosSelectBtn selectedPosition={selectedPosition} selectPosition={selectPosition} position="observer" color="athens-main">
          관찰자
        </ModalPosSelectBtn>
        <span className="pl-6 text-xs">로 입장</span>
      </div>
      <button
        type="button"
        aria-label="아고라 입장하기"
        disabled={isLoading}
        onClick={enterAgora}
        className="mt-2rem text-sm bg-athens-main p-0.5rem w-full text-white rounded-lg"
      >
        {isLoading ? <Loading w="16" h="16" /> : '입장하기'}
      </button>
    </ModalBase>
  );
}
