'use client';

import usePreviousPage from '@/hooks/usePreviousPage';
import React, { Suspense } from 'react';

function SessionNavigationObserver() {
  usePreviousPage();

  return null;
}

function SuspensePreviousPageComponent() {
  return (
    <Suspense fallback={null}>
      <SessionNavigationObserver />
    </Suspense>
  );
}

export default SuspensePreviousPageComponent;
