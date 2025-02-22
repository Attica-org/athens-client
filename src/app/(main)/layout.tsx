import React from 'react';
import SetChatInfoReset from '../_components/utils/SetChatInfoReset';

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <div className="h-dvh lg:flex overflow-y-hidden inset-y-full justify-center items-center xl:w-[1580px] lg:w-[1024px] under-large:w-full">
      <SetChatInfoReset />
      {children}
      {modal}
    </div>
  );
}
