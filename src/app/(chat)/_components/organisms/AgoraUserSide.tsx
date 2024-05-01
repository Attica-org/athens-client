"use client";

import RemoveIcon from "@/assets/icons/RemoveIcon";
import AgoraUserList from "../molecules/AgoraUserList";
import { MouseEventHandler, useState } from "react";

type UserList = {
  id: number;
  name: string;
  position: "pro" | "con";
};

type Props = {};

export default function AgoraUserSide() {
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

  // TODO: 전역 상태로 메뉴를 열고 닫도록 수정
  const [toggle, setToggle] = useState(false);
  const toggleMenu = () => {
    setToggle(!toggle);
  };

  const onClickOutside: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) toggleMenu();
  };

  return (
    <aside aria-label="채팅 참여자 목록" aria-hidden={toggle ? false : true}>
      <div
        className={`absolute inset-0 bg-gray-400 bg-opacity-75 duration-500 transition-opacity ${
          !toggle && "pointer-events-none opacity-0"
        }`}
        onClick={onClickOutside}
      />
      <div
        className={`absolute inset-y-0 right-0 flex max-w-full pl-10 ${
          toggle ? "z-15" : "pointer-events-none"
        }`}
      >
        <section
          className={`p-1rem right-0 transition duration-500 ease-in-out w-screen inset-y-0 bg-white flex-1 flex-col h-dvh border-l-1 border-athens-gray max-w-15rem xl:w-15rem under-mobile:w-[70vw] ${
            toggle ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div
            aria-hidden={!toggle}
            className="flex justify-between items-center pb-1rem"
          >
            <h2 className="text-base font-semibold">대화상대</h2>
            <button aria-label="참여자 목록 닫기" onClick={toggleMenu}>
              <RemoveIcon className="w-15 cursor-pointer" />
            </button>
          </div>
          <AgoraUserList position="pro" userList={userList} />
          <div className="border-b-1 border-gray-200 mb-1rem" />
          <AgoraUserList position="con" userList={userList} />
        </section>
      </div>
    </aside>
  );
}
