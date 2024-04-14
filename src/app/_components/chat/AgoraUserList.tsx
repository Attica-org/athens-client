"use client";

import { usePathname } from "next/navigation";

export default function AgoraUserList() {
  let pathname = usePathname();

  if (pathname !== "/chat") return null;

  return (
    <section className="flex-1 flex-col h-dvh bg-blue-600 max-w-18rem flex-grow hidden lg:block">
      <h1>유저 리스트입니다 여기는 유저 리스트 입니다.</h1>
    </section>
  );
}
