"use client";

import HomeIcon from "@/assets/icons/homeIcon";
import AddIcon from "@/assets/icons/addIcon";
import { useSelectedLayoutSegment } from "next/navigation";
import MobileNavLink from "../atoms/MobileNavLink";
import DesktopNavLink from "../atoms/DesktopNavLink";

export default function NavLinks() {
  const pathname = useSelectedLayoutSegment();

  return (
    <>
      <div className="hidden lg:block">
        <ul>
          <DesktopNavLink href="/">
            <div className="hover:bg-gray-100 h-3rem p-1rem inline-flex flex-row justify-center items-center mb-1rem rounded-full">
              <HomeIcon className="w-1.5rem" segment={pathname} />
              <span
                className={`pl-1rem ${pathname === null ? "font-bold" : ""}`}
              >
                홈
              </span>
            </div>
          </DesktopNavLink>
          <DesktopNavLink
            href="/create-agora"
            className="bg-athens-button w-8rem p-8 h-3rem flex justify-center items-center rounded-full"
          >
            <span className="text-white">아고라 생성</span>
          </DesktopNavLink>
        </ul>
      </div>
      <div className="block lg:hidden w-full h-4rem border-t-2 border-gray-100">
        <ul className="flex flex-row h-full justify-around">
          <MobileNavLink
            className="flex p-5 text-xs flex-col justify-center items-center"
            href="/"
          >
            <HomeIcon className="w-27 pb-2" segment={pathname} />홈
          </MobileNavLink>
          <MobileNavLink
            className="flex flex-col text-xs justify-center items-center p-10"
            href="/create-agora"
          >
            <AddIcon className="w-27 pb-2" segment={pathname} />
            아고라생성
          </MobileNavLink>
        </ul>
      </div>
    </>
  );
}
