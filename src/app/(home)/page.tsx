import React, { Suspense } from 'react';
import Main from './_components/templates/Main';
import SearchDeciderSuspense from './_components/templates/SearchDeciderSuspense';

type Props = {
  searchParams: { st: string, cat: string, q?: string }
};

export default function Home({ searchParams }: Props) {
  return (
    <Main>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchDeciderSuspense searchParams={searchParams} />
      </Suspense>
    </Main>
  );
}
