import React, { Suspense } from 'react';
import Loading from '@/app/(home)/loading';
import AgoraStatus from '../atoms/AgoraStatus';
import AgoraStatusTab from '../atoms/AgoraStatusTab';
import PageTitle from '../atoms/PageTitle';
import SearchBar from '../atoms/SearchBar';
import CategoryButtonContainer from '../organisms/CategoryButtonContainer';
import SearchDeciderSuspense from '../organisms/SearchDeciderSuspense';

type Props = {
  searchParams: { st: string, cat: string, q?: string }
};

export default function Main({ searchParams }: Props) {
  return (
    <section className="flex flex-col flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen dark:bg-dark-bg-light">
      <header className="p-1rem pb-0 relative min-w-270">
        <PageTitle
          title="아고라 검색"
          desc="토론에 참여하고 싶은 아고라를 선택해주세요."
        >
          <AgoraStatus />
        </PageTitle>
      </header>
      <main className="justify-center items-stretch flex flex-col h-fit flex-1 relative">
        <section className="sticky top-0 z-10 bg-white dark:bg-dark-bg-light">
          <div className="p-1rem pt-8 pb-0.5rem ">
            <SearchBar />
          </div>
          <div className="w-full pb-0.5rem">
            <AgoraStatusTab />
            <CategoryButtonContainer />
          </div>
        </section>
        <section
          aria-label="아고라 리스트"
          className="flex flex-1 flex-col p-5 pt-3 pb-5rem justify-start items-center"
        >
          <Suspense fallback={<Loading />}>
            <SearchDeciderSuspense searchParams={searchParams} />
          </Suspense>
        </section>
      </main>
    </section>
  );
}
