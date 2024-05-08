import React from 'react';
import Main from './_components/templates/Main';
import AgoraList from './_components/molecules/AgoraList';

type Props = {
  searchParams: { status: string, category: string }
};

export default function Home({ searchParams }: Props) {
  return (
    <Main>
      <AgoraList searchParams={searchParams} />
    </Main>
  );
}
