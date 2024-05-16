import Message from '@/app/(chat)/_components/molecules/Message';
import React from 'react';
import ChatNotification from '../../_components/atoms/ChatNotification';

export default function Page() {
  return (
    <main
      aria-label="채팅"
      className="flex flex-1 flex-col justify-between h-full"
    >
      <Message />
      <ChatNotification />
    </main>
  );
}
