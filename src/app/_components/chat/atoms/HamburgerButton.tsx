"use client";

import HamburgerIcon from "@/assets/icons/HamburgerIcon";

export default function HamburgerButton() {
  const toggleMenu = () => {
    console.log("toggle menu");
  };

  // TODO: 전역 상태로 메뉴를 열고 닫도록 수정

  return (
    <div onClick={toggleMenu}>
      <HamburgerIcon className="w-22" />
    </div>
  );
}
