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
  const agoraId = pathname.split('/')[2];

  useEffect(() => {
    const accessToken = tokenManager.getToken();
    tokenManager.setRedirectUrl(pathname);
    if (!accessToken) {
      router.replace(`/flow/enter-agora/${agoraId}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agoraId, router]);

  const accessToken = tokenManager.getToken();

  if (!accessToken) {
    return null;
  }

  return <div className="overflow-y-hidden overflow-x-hidden h-dvh flex w-full inset-y-full justify-center items-center xl:w-[1580px]">{children}</div>;
}
