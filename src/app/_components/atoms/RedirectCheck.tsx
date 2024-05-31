'use client';

import tokenManager from '@/utils/tokenManager';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function RedirectCheck({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = tokenManager.getToken();
    if (!accessToken) {
      tokenManager.setRedirectUrl(pathname);
      router.push('/flow/enter-agora');
    }
  }, [pathname, router]);

  const accessToken = tokenManager.getToken();

  if (!accessToken) {
    return null;
  }

  return <div>{children}</div>;
}
