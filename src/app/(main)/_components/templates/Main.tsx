import React, { Suspense } from 'react';
import Loading from '../atoms/loading';
import SearchDeciderSuspense from '../organisms/SearchDeciderSuspense';

type Props = {
  searchParams: { status: string, category: string, q?: string }
};

export default function Main({ searchParams }: Props) {
  return (
    <main className="justify-center items-stretch flex flex-col h-fit flex-1 relative">
      <section
        aria-label="아고라 리스트"
        className="flex flex-1 flex-col p-5 pt-3 pb-5rem justify-start items-center"
      >
        <Suspense fallback={<Loading />}>
          <SearchDeciderSuspense searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
