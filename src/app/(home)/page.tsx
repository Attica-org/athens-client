import React, { Suspense } from 'react';
import Main from './_components/templates/Main';
import SearchDeciderSuspense from './_components/organisms/SearchDeciderSuspense';
import Loading from './loading';

type Props = {
  searchParams: { st: string, cat: string, q?: string }
};

export default function Home({ searchParams }: Props) {
  return (
    <Main>
      <Suspense fallback={<Loading />}>
        <SearchDeciderSuspense searchParams={searchParams} />
      </Suspense>
    </Main>
  );
}
