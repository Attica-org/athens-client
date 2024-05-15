import React from 'react';
import PageTitle from '../_components/atoms/PageTitle';
import AgoraStatus from '../_components/atoms/AgoraStatus';
import SearchBar from '../_components/atoms/SearchBar';
import AgoraStatusTab from '../_components/atoms/AgoraStatusTab';
import CategoryButtonContainer from '../_components/organisms/CategoryButtonContainer';
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
        <div>
          <section className="sticky top-0 z-10 bg-white dark:bg-dark-bg-light">
            <div className="p-1rem pt-8 pb-0.5rem ">
              <SearchBar />
            </div>
            <div className="w-full pb-0.5rem">
              <AgoraStatusTab />
              <CategoryButtonContainer />
            </div>
          </section>
          {children}
        </div>
      </section>
    </>
  );
}
