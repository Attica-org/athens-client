"use client";

import HomeIcon from "@/assets/icons/homeIcon";
import AddIcon from "@/assets/icons/addIcon";
import { useSelectedLayoutSegment } from "next/navigation";
import MobileNavLink from "../atoms/MobileNavLink";
import DesktopNavLink from "../atoms/DesktopNavLink";

export default function NavLinks() {
  const pathname = useSelectedLayoutSegment();
  // 전역 상태 관리 훅을 사용하여 pathname을 가져온다.
  // create-agora 페이지에서는 전역 상태를 create-agora로 설정하고, 그 외의 페이지에서는 home으로 설정한다.

  return (
    <>
      <div className="hidden lg:block">
        <ul>
          <DesktopNavLink href="/" segment={pathname} innerText="홈">
            <HomeIcon className="w-1.5rem" segment={pathname} />
          </DesktopNavLink>
          <DesktopNavLink
            href="/create-agora"
            segment={`/${pathname}`}
            innerText="아고라 생성"
          >
            <AddIcon className="w-1.5rem" segment={pathname} />
          </DesktopNavLink>
        </ul>
      </div>
      <div className="block lg:hidden w-full h-58 border-t-2 border-gray-100">
        <ul className="flex flex-row h-full justify-around">
          <MobileNavLink
            className="flex p-5 text-xs flex-col justify-center items-center"
            href="/"
          >
            <HomeIcon className="w-23 pb-2" segment={pathname} />홈
          </MobileNavLink>
          <MobileNavLink
            className="flex flex-col text-xs justify-center items-center p-10"
            href="/create-agora"
          >
            <AddIcon className="w-23 pb-2" segment={pathname} />
            아고라생성
          </MobileNavLink>
        </ul>
      </div>
    </>
  );
}
