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
      <div className="h-dvh w-full inset-y-full justify-center items-center">
        <Header />
        <section>{children}</section>
      </div>
    </>
  );
}
