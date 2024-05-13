import React from 'react';
import Main from './_components/templates/Main';

type Props = {
  searchParams: { st: string, cat: string, q?: string }
};

export default function Home({ searchParams }: Props) {
  return (
    <Main searchParams={searchParams} />
  );
}
