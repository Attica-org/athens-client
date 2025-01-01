import React from 'react';
import SideNav from '../_components/organisms/NavMenu';
import PageTitle from '../_components/molecules/PageTitle';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <SideNav />
      <section className="overflow-hidden scrollbar-hide flex flex-col flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen dark:bg-dark-bg-light">
        <header className="p-1rem pb-0 relative min-w-270">
          <PageTitle title="내 정보 관리" desc="계정 정보를 확인하세요." />
        </header>
        {children}
      </section>
    </>
  );
}
