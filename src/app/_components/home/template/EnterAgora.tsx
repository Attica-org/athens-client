"use client";

import ModalBase from "../molecules/ModalBase";

export default function EnterAgora() {
  return (
    <ModalBase>
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
    </ModalBase>
  );
}
