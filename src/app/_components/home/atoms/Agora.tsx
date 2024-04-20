"use client";

import { useRouter } from "next/navigation";

export default function Agora() {
  const router = useRouter();

  //TODO: 아고라 id를 받아서 해당 아고라로 이동
  const enterAgora = () => {
    router.push("/flow/enter-agora");
  };

  return (
    <article className="w-10rem under-mobile:w-130 p-10 border-1 rounded-lg flex flex-col justify-center items-center">
      <div className="under-mobile:w-3rem under-mobile:h-3rem w-4rem h-4rem rounded-2xl bg-yellow-400 relative">
        <div className="w-0.5rem h-0.5rem rounded-full bg-red-400 absolute top-2 right-1 z-5" />
      </div>
      <h3 className="text-xs under-mobile:text-xxs under-mobile:font-semibold pt-10">
        국가 발전에는 유능한 독재자가 필요한 시기가 있다
      </h3>
      <p className="text-xxs pt-7">
        <span className="pb-1">
          <span className="pr-5 text-athens-gray-500 text-nowrap">
            <span className="text-blue-500 pr-3">찬성</span>10명
          </span>
          <span className="pr-5 text-athens-gray-500 text-nowrap">
            <span className="text-red-500 pr-3">반대</span>10명
          </span>
        </span>
        <span className="under-mobile:block">
          <span className="pr-3">관찰자</span>
          <span className="text-athens-gray-500">10명</span>
        </span>
      </p>
      <button
        onClick={enterAgora}
        className="text-sm under-mobile:text-xs text-white bg-athens-main p-4 pt-5 pb-5 mt-10 w-8rem under-mobile:w-6rem rounded-md"
      >
        입장하기
      </button>
    </article>
  );
}
