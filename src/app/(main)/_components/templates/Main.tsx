import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SearchParams } from '@/app/model/Agora';
import Loading from '@/app/_components/atoms/loading';

type Props = {
  searchParams: SearchParams;
};

const AgoraListDeciderHydration = dynamic(
  () => import('../organisms/AgoraListDeciderHydration'),
);

export default function Main({ searchParams }: Props) {
  return (
    <main
      aria-label="아고라 리스트"
      className="justify-center items-stretch flex flex-col h-dvh flex-1 relative"
    >
      <div className="flex h-full flex-col p-5 pt-3 pb-5rem justify-start items-center">
        <Suspense
          fallback={
            <Loading className="m-5 flex justify-center items-center" />
          }
        >
          <AgoraListDeciderHydration searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
