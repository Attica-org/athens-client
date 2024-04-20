"use client";

import { MouseEventHandler, useEffect } from "react";
import BackButton from "../atoms/BackButton";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function ModalBase({ children }: Props) {
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
      <div className="mt-10rem under-mobile:mt-14rem bg-white bottom-7rem mobile:w-[70vw] pb-2rem under-mobile:pb-1rem under-mobile:w-[80vw] w-[50vw] lg:w-40rem relative rounded-2xl min-w-220">
        <BackButton className="absolute right-2rem top-25" />
        {children}
      </div>
    </div>
  );
}
