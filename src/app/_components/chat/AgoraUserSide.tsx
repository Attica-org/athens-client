"use client";

import RemoveIcon from "@/assets/icons/RemoveIcon";
import AgoraUserList from "./molecules/AgoraUserList";
import { MouseEventHandler } from "react";

type UserList = {
  id: number;
  name: string;
  position: "pro" | "con";
};

type Props = {
  toggleMenu: () => void;
  toggle: boolean;
};

export default function AgoraUserSide({ toggleMenu, toggle }: Props) {
  const userList: UserList[] = [
    {
      id: 1,
      name: "총 든 토끼",
      position: "con",
    },
    {
      id: 2,
      name: "도끼 든 회색 곰",
      position: "pro",
    },
    {
      id: 3,
      name: "노트북 하는 병아리",
      position: "pro",
    },
  ];

  const onClickOutside: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) toggleMenu();
  };

  return (
    <>
      <div
        className={`absolute inset-0 bg-gray-400 bg-opacity-75 duration-500 transition-opacity ${
          !toggle && "pointer-events-none opacity-0"
        }`}
        aria-hidden
        onClick={onClickOutside}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex max-w-full pl-10 ${
          toggle ? "z-15" : "pointer-events-none"
        }`}
      >
        <section
          className={`p-1rem right-0 transition duration-500 ease-in-out w-screen inset-y-0 bg-white flex-1 flex-col h-dvh border-l-1 border-athens-gray max-w-15rem xl:w-15rem under-mobile:w-[70vw] ${
            toggle ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center pb-1rem">
            <h3 className="text-base font-semibold">대화상대</h3>
            <div onClick={toggleMenu}>
              <RemoveIcon className="w-15 cursor-pointer" />
            </div>
          </div>
          <AgoraUserList position="pro" userList={userList} />
          <div className="border-b-1 border-gray-200 mb-1rem" />
          <AgoraUserList position="con" userList={userList} />
        </section>
      </aside>
    </>
  );
}
