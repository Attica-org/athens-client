"use client";

import { useState } from "react";

type Status = "active" | "end";

export default function AgoraStatusTab() {
  const [status, setStatus] = useState<Status>("active");

  const changeStatus = () => {
    setStatus(status === "active" ? "end" : "active");
  };

  return (
    <nav className="flex flex-row justify-around items-center h-2rem w-full text-xs pl-5 pr-5">
      <button
        onClick={changeStatus}
        className={`border-b-1 ${
          status === "active" && "border-athens-sub"
        } flex flex-1 justify-center p-6`}
      >
        활성화
      </button>
      <button
        onClick={changeStatus}
        className={`flex flex-1 justify-center p-6 border-b-1 ${
          status === "end" && "border-athens-sub"
        }`}
      >
        종료
      </button>
    </nav>
  );
}
