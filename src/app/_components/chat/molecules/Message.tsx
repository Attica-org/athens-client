"use client";
import MyMessage from "../atoms/MyMessage";
import YourMessage from "../atoms/YourMessage";
import { Message as IMessage } from "@/app/model/Message";

export default function Message() {
  const myRole = "con";
  const message: IMessage[] = [
    {
      messageId: 1,
      role: "pro",
      content: "안녕하십니까 형님",
      name: "도끼 든 회색 곰",
      createdAt: "11:02",
    },
    {
      messageId: 2,
      role: "con",
      content:
        "나는 낭만 고양이 나는 고양이가 되고 싶어요. 그렇게 나는 길고양이가 되었다고 한다..",
      name: "총 든 토끼",
      createdAt: "11:02",
    },
    {
      messageId: 3,
      role: "pro",
      content: "아따맘마를 아세요?",
      name: "노트북 하는 병아리",
      createdAt: "11:02",
    },
  ];

  return (
    <div>
      {message.map((message) => (
        <div key={message.messageId}>
          {message.role === myRole ? (
            <MyMessage message={message} />
          ) : (
            <YourMessage message={message} />
          )}
        </div>
      ))}
    </div>
  );
}
