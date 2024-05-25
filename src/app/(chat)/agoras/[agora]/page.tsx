import Message from '@/app/(chat)/_components/molecules/Message';
import React from 'react';

export default function Page() {
  return (
    <main
      aria-label="채팅"
      className="flex flex-col justify-between h-full items-stretch"
    >
      <Message />
    </main>
  );
}
