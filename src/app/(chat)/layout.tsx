import React from 'react';
import Header from './_components/organisms/Header';
import MessageInput from './_components/molecules/MessageInput';
import ChatPageLoadConfig from '../config/ChatPageLoadConfig';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="w-full overflow-y-hidden overflow-x-hidden h-dvh flex justify-center items-center xl:w-[1580px] relative">
      <section className="w-full flex flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen absolute top-0">
        <ChatPageLoadConfig>
          <section className="flex flex-1 flex-col w-full relative h-dvh">
            <header className="sticky w-full top-0 bg-white dark:bg-dark-bg-light pt-10 min-w-270 border-b-1 border-gray-200 dark:border-dark-light-300">
              <Header />
            </header>
            {children}
            <MessageInput />
          </section>
        </ChatPageLoadConfig>
      </section>
    </div>
  );
}
