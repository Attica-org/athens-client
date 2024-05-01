"use client";

import SendIcon from "@/assets/icons/SendIcon";

export default function MessageInput() {
  return (
    <section className="flex border-t-1 sticky bottom-0 right-0 left-0 w-full bg-white">
      <form className="pl-1.5rem p-12 flex flex-1 justify-start items-center">
        <input
          aria-label="보낼 메세지 입력창"
          type="text"
          placeholder="Type a message"
          className="placeholder:text-athens-gray-thick text-base w-full focus-visible:outline-none"
        />
      </form>
      <button
        aria-label="메세지 보내기"
        className="bg-athens-main p-12 cursor-pointer"
      >
        <SendIcon className="w-1.5rem" fill="white" />
      </button>
    </section>
  );
}
