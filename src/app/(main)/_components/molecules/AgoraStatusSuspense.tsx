import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import AgoraStatusSkeleton from '../atoms/AgoraStatusSkeleton';

const AgoraStatusTab = dynamic(() => import('../atoms/AgoraStatusTab'));

export default function AgoraStatusSuspense() {
  return (
    <Suspense fallback={<AgoraStatusSkeleton />}>
      <AgoraStatusTab />
    </Suspense>
  );
}
