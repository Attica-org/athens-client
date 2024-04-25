"use client";

import UserImage from "../atoms/UserImage";
import AgoraUserList from "./molecules/AgoraUserList";

type UserList = {
  id: number;
  name: string;
  position: "pro" | "con";
};

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

  return (
    <section className="flex-1 flex-col h-dvh border-l-1 border-athens-gray max-w-15rem flex-grow hidden xl:block">
      <div className="p-1rem">
        <h3 className="text-base pb-1rem font-semibold">대화상대</h3>
        <AgoraUserList position="pro" userList={userList} />
        <AgoraUserList position="con" userList={userList} />
      </div>
    </section>
  );
}
