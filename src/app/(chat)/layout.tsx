import React from 'react';
import Header from './_components/organisms/Header';
import MessageInput from './_components/molecules/MessageInput';
import AgoraUserSide from './_components/organisms/AgoraUserSide';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="w-full overflow-y-hidden overflow-x-hidden h-full flex justify-center items-center xl:w-[1580px] relative">
      <section className="w-full flex flex-1 h-full max-lg:pb-3rem min-w-270 flex-grow max-width-screen absolute top-0">
        <section className="overflow-y-hidden flex flex-1 h-full flex-col w-full relative">
          <section className="sticky w-full top-0 bg-white dark:bg-dark-bg-light pt-10 min-w-270 border-b-1 border-gray-200 dark:border-dark-light-300">
            <Header />
          </section>
          {children}
          <MessageInput />
        </section>
        <AgoraUserSide />
      </section>
    </div>
  );
}
