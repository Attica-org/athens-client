"use client";

import BackButton from "@/app/_components/BackButton";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect } from "react";

export default function CreateAgora() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const clickOutSideModal: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) router.back();
  };

  return (
    <div
      onClick={clickOutSideModal}
      className="w-dvw h-dvh flex absolute justify-center items-center z-20 top-0 right-0 left-0 bottom-0 bg-opacity-20 bg-gray-600"
    >
      <div className="bg-white bottom-7rem mobile:w-[70vw] under-mobile:w-[80vw] w-[50vw] lg:w-40rem h-[27vh] under-mobile:h-[26vh] relative rounded-2xl min-w-220">
        <BackButton className="absolute right-2rem top-25" />
        <h3 className="flex justify-center items-center mt-2rem text-base">
          입장
        </h3>
        <p className="text-sm p-2rem pb-1.5rem flex justify-center items-cener text-center break-keep font-medium">
          국가 발전에 유능한 독재자가 필요한 시기가 있다.
        </p>
        <div className="flex justify-center items-center text-sm under-mobile:text-xs min-w-200">
          <button className="p-0.5rem pr-1rem pl-1rem text-white bg-blue-400 rounded-xl mr-0.5rem">
            찬성
          </button>
          <button className="p-0.5rem pr-1rem pl-1rem text-white bg-red-400 rounded-xl mr-0.5rem">
            반대
          </button>
          <button className="p-0.5rem pr-1rem pl-1rem text-white bg-athens-main rounded-xl">
            관찰자
          </button>
        </div>
      </div>
    </div>
  );
}
