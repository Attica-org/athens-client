import React from 'react';
import SearchAgoraList from '../_components/organisms/SearchAgoraList';
import Main from '../_components/templates/Main';

type Props = {
  searchParams: { st: string, cat: string, q?: string }
};

export default function Search({ searchParams }: Props) {
  return (
    <Main>
      {searchParams.q && <SearchAgoraList searchParams={searchParams} />}
    </Main>
  );
}
