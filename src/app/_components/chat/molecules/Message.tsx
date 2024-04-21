"use client";
import Image from "next/image";
import { useState } from "react";
import MyMessage from "../atoms/MyMessage";
import YourMessage from "../atoms/YourMessage";

type Message = {
  role: string;
  message: string;
  name: string;
  createdAt: string;
};

export default function Message() {
  const myRole = "pro";
  const [message, setMessage] = useState<Message>({
    role: "pro",
    message:
      "안녕하십니까 형님 안녕하십니까 형님 안녕하십니까 형님 안녕하십니까 형님 안녕하십니까 형님",
    name: "도끼 든 회색 곰",
    createdAt: "11:02",
  });

  return (
    <div>
      {message.role === myRole ? (
        <MyMessage message={message} />
      ) : (
        <YourMessage message={message} />
      )}
    </div>
  );
}
