import { Message } from "@/app/model/Message";
import Image from "next/image";

export default function MyMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end items-start p-1rem h-full">
      <div className="flex justify-end items-end">
        <div className="flex flex-col justify-end items-end h-full">
          <div className="text-xxs mb-8">{message.createdAt}</div>
        </div>
        <div className="p-0.5rem flex flex-col justify-center items-end">
          <div className="text-xs pb-5">{message.name}</div>
          <div className="max-w-[50vw] whitespace-pre-line bg-red-200 rounded-tl-xl rounded-bl-xl rounded-br-xl p-0.5rem pl-14 pr-14 text-sm">
            {message.content}
          </div>
        </div>
      </div>
      <div className="border-1 border-gray-300 w-fit rounded-xl ">
        <Image
          src={`/img/${message.name}.png`}
          alt="사용자 프로필 이미지"
          width={60}
          height={60}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
