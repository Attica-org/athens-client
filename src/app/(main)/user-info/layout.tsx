import React from 'react';
import Header from './_component/molecules/Header';
import SideNav from '../_components/organisms/NavMenu';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <SideNav />
      <div className="flex flex-col flex-1 h-dvh flex-grow max-width-screen min-w-270 inset-y-full">
        <Header />
        <section>{children}</section>
      </div>
    </>
  );
}
