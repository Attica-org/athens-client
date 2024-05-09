import React from 'react';
import Main from './_components/templates/Main';
import AgoraList from './_components/molecules/AgoraList';

type Props = {
  searchParams: { st: string, cat: string, q?: string }
};

export default function Home({ searchParams }: Props) {
  return (
    <Main>
      {searchParams.cat && <AgoraList searchParams={searchParams} />}
    </Main>
  );
}
