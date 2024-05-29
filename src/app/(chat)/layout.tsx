import React from 'react';
import Header from './_components/molecules/Header';
import MessageInput from './_components/molecules/MessageInput';
import AgoraUserSide from './_components/organisms/AgoraUserSide';
import RedirectCheck from '../_components/atoms/RedirectCheck';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <RedirectCheck>
      <div className="lg:flex overflow-x-hidden xl:w-[1580px] w-full">
        <section className="flex flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen relative">
          <section className="flex flex-1 h-dvh flex-col">
            <div className="overflow-y-hidden justify-center items-stretch flex flex-col w-full h-full flex-1 relative">
              <section className="flex sticky w-full top-0 bg-white dark:bg-dark-bg-light justify-between items-center pt-10 min-w-270 border-b-1 border-gray-200 dark:border-dark-light-300">
                <Header />
              </section>
              {children}
              <MessageInput />
            </div>
          </section>
          <AgoraUserSide />
        </section>
      </div>
    </RedirectCheck>
  );
}
