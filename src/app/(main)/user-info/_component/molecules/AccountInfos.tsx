'use client';

import type { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ANYNYMOUS, AUTHENTICATED, AUTH_PROVIDERS } from '@/constants/Auth';
import isNull from '@/utils/isNull';
import AccountInfo from '../atoms/AccountInfo';

type Props = {
  className?: string;
};

export default function AccountInfos({ className }: Props) {
  const session = useSession();

  const [name, setName] = useState<Session['data']['user']['name']>(ANYNYMOUS);
  const [email, setEmail] =
    useState<Session['data']['user']['email']>(ANYNYMOUS);
  const [authProvider, setAuthProvider] =
    useState<Session['data']['user']['authProvider']>(ANYNYMOUS);

  const convertAuthProvider = (provider: string) => {
    switch (provider) {
      case AUTH_PROVIDERS.GOOGLE:
        return '구글';
      case AUTH_PROVIDERS.KAKAO:
        return '카카오';
      default:
        return AUTH_PROVIDERS.DEFAULT;
    }
  };

  useEffect(() => {
    if (!isNull(session) && session.status === AUTHENTICATED) {
      setName(session.data.user?.name ?? ANYNYMOUS);
      setEmail(session.data.user?.email ?? ANYNYMOUS);
      setAuthProvider(session.data.user?.authProvider ?? ANYNYMOUS);
    }
  }, [session]);

  return (
    <section className={className}>
      <h1 className="font-bold mb-20 dark:text-white">내 정보</h1>
      <AccountInfo label="이름" content={name} className="mb-10" />
      <AccountInfo
        label="이메일"
        content={email}
        className="mb-10 items-center justify-center"
      />
      <AccountInfo
        label="소셜로그인"
        content={convertAuthProvider(authProvider)}
      />
    </section>
  );
}
