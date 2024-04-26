"use client";

import Header from "@/app/_components/chat/molecules/Header";
import MessageInput from "@/app/_components/chat/molecules/MessageInput";
import Message from "@/app/_components/chat/molecules/Message";
import AgoraUserSide from "@/app/_components/chat/AgoraUserSide";
import { useState } from "react";

export default function Page() {
  // TODO: 전역 상태로 메뉴를 열고 닫도록 수정
  const [toggle, setToggle] = useState(false);
  const toggleMenu = () => {
    setToggle(!toggle);
  };

  return (
    <section className="flex flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen relative">
      <section className="flex flex-1 h-dvh flex-col">
        <main className="justify-center items-stretch flex flex-col w-full h-full flex-1 relative">
          <section className="flex sticky w-full top-0 bg-white justify-between items-center pt-10 pb-5 min-w-270 border-b-1 border-gray-200">
            <Header toggleMenu={toggleMenu} />
          </section>
          <section className="flex flex-1 flex-col justify-between">
            <Message />
            <div className="flex p-0.5rem pl-1rem pr-1rem">
              <div className="rounded-lg text-center flex justify-center items-center text-sm under-mobile:text-xs text-gray-400 p-11 bg-athens-gray w-full break-keep">
                사용자들간의 쾌적한 토론 환경을 위해 바른말을 사용해주세요.
              </div>
            </div>
          </section>
          <MessageInput />
        </main>
      </section>
      <AgoraUserSide toggleMenu={toggleMenu} toggle={toggle} />
    </section>
  );
}
