import React from 'react';
import Main from '../_components/templates/Main';

type Props = {
  searchParams: { status?: string, category?: string, q?: string }
};

export default function Page({ searchParams }: Props) {
  return (
    <Main searchParams={searchParams} />
  );
}
