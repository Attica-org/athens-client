'use client';

import Loading from '@/app/_components/atoms/loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';
import isNull from '@/utils/validation/validateIsNull';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useGetAccessTokenAction } from '@/hooks/useGetAccessTokenAction';

type Props = {
  user: string;
  callbackUrl: string;
};

export default function AuthLogin({ user, callbackUrl }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const routeAgoraPage = useCallback(
    (path: string) => {
      router.replace(path);
    },
    [router],
  );

  useGetAccessTokenAction({ routeAgoraPage, user });

  useEffect(() => {
    if (!isNull(callbackUrl) && !isNull(session)) {
      routeAgoraPage(homeSegmentKey);
    }
  }, [routeAgoraPage, session]);

  return (
    <div className="min-w-300 w-full h-full flex absolute justify-center items-center z-20 top-0 right-0 left-0 bottom-0 bg-opacity-50 bg-dark-bg-dark">
      <Loading className="absolute z-100" w="32" h="32" />
    </div>
  );
}
