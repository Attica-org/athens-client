import Header from '@/app/(chat)/_components/molecules/Header';
import MessageInput from '@/app/(chat)/_components/molecules/MessageInput';
import Message from '@/app/(chat)/_components/molecules/Message';
import AgoraUserSide from '@/app/(chat)/_components/organisms/AgoraUserSide';
import React from 'react';
import ChatNotification from '../../_components/atoms/ChatNotification';

export default function Page() {
  return (
    <section className="flex flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen relative">
      <section className="flex flex-1 h-dvh flex-col">
        <main className="justify-center items-stretch flex flex-col w-full h-full flex-1 relative">
          <section className="flex sticky w-full top-0 bg-white dark:bg-dark-bg-light justify-between items-center pt-10 min-w-270 border-b-1 border-gray-200 dark:border-dark-light-300">
            <Header />
          </section>
          <section
            aria-label="채팅"
            className="flex flex-1 flex-col justify-between"
          >
            <Message />
            <ChatNotification />
          </section>
          <MessageInput />
        </main>
      </section>
      <AgoraUserSide />
    </section>
  );
}
