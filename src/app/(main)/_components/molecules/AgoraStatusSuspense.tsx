import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const AgoraStatusTab = dynamic(() => import('../atoms/AgoraStatusTab'));

export default function AgoraStatusSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgoraStatusTab />
    </Suspense>
  );
}
