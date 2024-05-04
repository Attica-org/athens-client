import React from 'react';
import SideNav from './_components/organisms/NavMenu';

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <div className="h-dvh lg:flex inset-y-full justify-center items-center xl:w-[1580px] lg:w-[1024px] under-large:w-full">
      <SideNav />
      {children}
      {modal}
    </div>
  );
}
