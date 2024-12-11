import React from 'react';
import PageTitle from '../_components/molecules/PageTitle';
import AgoraStatus from '../_components/atoms/AgoraStatus';
import SideNav from '../_components/organisms/NavMenu';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <SideNav />
      <section className="overflow-x-hidden scrollbar-hide flex flex-col flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen dark:bg-dark-bg-light">
        <header className="p-1rem pb-0 relative min-w-270">
          <PageTitle
            title="아고라 검색"
            desc="토론에 참여하고 싶은 아고라를 선택해주세요."
          >
            <AgoraStatus />
          </PageTitle>
        </header>
        <div>{children}</div>
      </section>
    </>
  );
}
