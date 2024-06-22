import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '../atoms/loading';

type Props = {
  searchParams: { status?: string; category?: string; q?: string };
};

const SearchDeciderSuspense = dynamic(
  () => import('../organisms/SearchDeciderSuspense'),
);

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
