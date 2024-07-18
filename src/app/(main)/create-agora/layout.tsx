import React from 'react';
import PageTitle from '../_components/molecules/PageTitle';
import SideNav from '../_components/organisms/NavMenu';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <SideNav />
      <section className="overflow-hidden scrollbar-hide flex flex-col flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen dark:bg-dark-bg-light">
        <header className="p-1rem pb-0 relative min-w-270">
          <PageTitle
            title="아고라 생성"
            desc="생성할 아고라 정보를 입력해주세요."
          />
        </header>
        {children}
      </section>
    </>
  );
}
