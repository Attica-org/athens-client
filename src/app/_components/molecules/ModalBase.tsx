"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RemoveButton from "../atoms/RemoveButton";

type Props = {
  children: React.ReactNode;
  title: string;
  removeIcon: boolean;
  animation: boolean;
};

export default function ModalBase({
  children,
  title,
  removeIcon,
  animation,
}: Props) {
  const router = useRouter();
  const [opacity, setOpacity] = useState("opacity-0");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setOpacity("opacity-100");

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [animation]);

  const clickOutSideModal: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget && removeIcon) router.back();
  };

  return (
    <div
      onClick={clickOutSideModal}
      className="w-dvw h-dvh flex absolute justify-center items-center z-20 top-0 right-0 left-0 bottom-0 bg-opacity-20 bg-gray-600"
    >
      <div
        className={`${
          animation && `transition duration-500 transform scale-100 `
        } ${opacity} under-mobile:mt-14rem bg-white bottom-7rem mobile:w-[70vw] pb-0.5rem under-mobile:pb-1rem under-mobile:w-[80vw] w-[50vw] lg:w-40rem relative rounded-2xl min-w-220`}
      >
        <h1 className="flex justify-center items-center mt-2rem text-md">
          {title}
        </h1>
        {removeIcon && <RemoveButton className="absolute right-20 top-20" />}
        <div className="p-14">{children}</div>
      </div>
    </div>
  );
}
