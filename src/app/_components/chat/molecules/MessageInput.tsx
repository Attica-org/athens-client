"use client";

import SendIcon from "@/assets/icons/SendIcon";

export default function MessageInput() {
  return (
    <section className="flex border-t-1 sticky bottom-0 right-0 left-0 w-full bg-white">
      <div className="pl-1.5rem p-12 flex flex-1 justify-start items-center">
        <input
          type="text"
          placeholder="Type a message"
          className="text-base w-full focus-visible:outline-none"
        />
      </div>
      <div className="bg-athens-main p-12 cursor-pointer">
        <SendIcon className="w-1.5rem" fill="white" />
      </div>
    </section>
  );
}
