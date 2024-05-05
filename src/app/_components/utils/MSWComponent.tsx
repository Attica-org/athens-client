'use client';

import { useEffect } from 'react';

export default function MSWComponent() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        import('@/mocks/browser');
      }
    }
  }, []);

  return null;
}
