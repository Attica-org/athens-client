import { Message } from "@/app/model/Message";
import Image from "next/image";

export default function YourMessage({ message }: Message) {
  return (
    <div className="flex justify-start items-start p-1rem h-full">
      <div className="border-1 border-gray-300 w-fit rounded-xl">
        <Image
          src="/img/도끼 든 회색 곰.png"
          alt="사용자 프로필 이미지"
          width={60}
          height={60}
          className="rounded-xl"
        />
      </div>
      <div className="p-0.5rem flex flex-col justify-center items-start">
        <div className="text-xs pb-5">{message.name}</div>
        <div className="max-w-[50vw] whitespace-pre-line bg-blue-200 rounded-tr-xl rounded-bl-xl rounded-br-xl p-0.5rem pl-14 pr-14 text-sm">
          {message.message}
        </div>
      </div>
      <div className="flex flex-col justify-end items-end h-full">
        <div className="text-xxs mb-8">{message.createdAt}</div>
      </div>
    </div>
  );
}
