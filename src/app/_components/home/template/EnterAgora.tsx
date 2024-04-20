"use client";

import Image from "next/image";
import ModalBase from "../molecules/ModalBase";
import { useState } from "react";

const profileImageNameList = [
  { id: 1, name: "도끼 든 회색 곰" },
  { id: 2, name: "노트북 하는 병아리" },
  { id: 3, name: "안경 쓴 기린" },
  { id: 4, name: "책 읽는 코알라" },
  { id: 5, name: "총을 든 토끼" },
];

type ProfileImageName = {
  id: number;
  name: string;
};

export default function EnterAgora() {
  const [selectedProfileImage, setSelectedProfileImage] =
    useState<ProfileImageName>({ id: 1, name: "도끼 든 회색 곰" });

  const selectProfile = (profile: ProfileImageName) => {
    setSelectedProfileImage(profile);
  };

  return (
    <ModalBase>
      <h1 className="flex justify-center items-center mt-2rem text-base">
        아고라 입장
      </h1>
      <p className="text-sm p-2rem pb-1.5rem flex justify-center items-cener text-center break-keep font-medium">
        국가 발전에 유능한 독재자가 필요한 시기가 있다.
      </p>
      <div>
        <div className="flex justify-start items-center">
          <div
            aria-label="사용자가 선택한 프로필 이미지"
            className="mb-10 border-1 border-gray-300 w-70 h-70 rounded-2xl flex justify-center items-center"
          >
            <Image
              src={`/img/${selectedProfileImage.name}.png`}
              alt="프로필 이미지"
              width={70}
              height={70}
              className="rounded-2xl object-contain"
            />
          </div>
          <div className="text-sm p-0.5rem w-fit ml-12">
            {selectedProfileImage.name}
          </div>
        </div>
        <div className="flex pl-1rem">
          {profileImageNameList.map((profileImageName) => (
            <div
              onClick={() => selectProfile(profileImageName)}
              key={profileImageName.id}
              className="mr-5 w-fit flex justify-center items-center border-1 border-gray-300 rounded-full"
            >
              <Image
                src={`/img/${profileImageName.name}.png`}
                alt={profileImageName.name}
                width={45}
                height={45}
                className="rounded-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center text-sm under-mobile:text-xs min-w-200">
        <button className="p-5 pr-1rem pl-1rem text-white bg-blue-400 rounded-xl mr-0.5rem">
          찬성
        </button>
        <button className="p-5 pr-1rem pl-1rem text-white bg-red-400 rounded-xl mr-0.5rem">
          반대
        </button>
        <button className="p-5 pr-1rem pl-1rem text-white bg-athens-main rounded-xl">
          관찰자
        </button>
      </div>
    </ModalBase>
  );
}
