"use client";

import Image from "next/image";
import ModalBase from "../molecules/ModalBase";
import { useState } from "react";
import { useRouter } from "next/navigation";

const profileImageNameList = [
  { id: 1, name: "도끼 든 회색 곰" },
  { id: 2, name: "노트북 하는 병아리" },
  { id: 3, name: "안경 쓴 기린" },
  { id: 4, name: "책 읽는 코알라" },
  { id: 5, name: "총 든 토끼" },
];

type ProfileImageName = {
  id: number;
  name: string;
};

type Position = "con" | "pro" | "watcher";

export default function EnterAgora() {
  const [selectedProfileImage, setSelectedProfileImage] =
    useState<ProfileImageName>({ id: 1, name: "도끼 든 회색 곰" });
  const [selectedPosition, setSelectedPosition] = useState<Position>("watcher");
  const router = useRouter();

  const selectProfile = (profile: ProfileImageName) => {
    setSelectedProfileImage(profile);
  };

  const selectPosition = (position: Position) => {
    setSelectedPosition(position);
  };

  const enterAgora = () => {
    router.push("/agora");
  };

  return (
    <ModalBase>
      <h1 className="flex justify-center items-center mt-1rem text-md">
        아고라 입장
      </h1>
      <p className="text-sm p-1rem pt-1.5rem pb-1.5rem flex justify-center items-cener text-center break-keep font-medium">
        국가 발전에 유능한 독재자가 필요한 시기가 있다.
      </p>
      <div className="flex flex-col justiy-start items-center">
        <div className="flex justify-start items-center mb-10">
          <div
            aria-label="사용자가 선택한 프로필 이미지"
            className="border-1 border-gray-300 w-70 h-70 rounded-2xl flex justify-center items-center"
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
      <div className="mt-2rem flex justify-center items-center text-sm under-mobile:text-xs min-w-200">
        <button
          onClick={() => selectPosition("pro")}
          className={`p-5 mobile:pr-1rem mobile:pl-1rem pr-10 pl-10 ${
            selectedPosition === "pro"
              ? "text-white bg-blue-400"
              : "text-blue-400 bg-white"
          } rounded-xl mr-7 text-xs tablet:text-sm `}
        >
          찬성
        </button>
        <button
          onClick={() => selectPosition("con")}
          className={`p-5 mobile:pr-1rem mobile:pl-1rem pr-10 pl-10 ${
            selectedPosition === "con"
              ? "text-white bg-red-400"
              : "text-red-400 bg-white"
          } rounded-xl mr-7 text-xs tablet:text-sm`}
        >
          반대
        </button>
        <button
          onClick={() => selectPosition("watcher")}
          className={`p-5 mobile:pr-1rem mobile:pl-1rem pr-10 pl-10 ${
            selectedPosition === "watcher"
              ? "text-white bg-athens-main"
              : "text-athens-main bg-white"
          } rounded-xl text-xs tablet:text-sm `}
        >
          관찰자
        </button>
        <span className="pl-6 text-xs">로 입장</span>
      </div>
      <button
        onClick={enterAgora}
        className="mt-2rem text-sm bg-athens-main p-0.5rem w-full text-white rounded-lg"
      >
        입장하기
      </button>
    </ModalBase>
  );
}
