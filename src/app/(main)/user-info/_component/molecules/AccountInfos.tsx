'use client';

import type { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  AUTHENTICATED,
  AuthProvider,
  AuthProviderLabels,
} from '@/constants/auth';
import isNull from '@/utils/validation/validateIsNull';
import AccountInfo from '../atoms/AccountInfo';

type Props = {
  className?: string;
};

export default function AccountInfos({ className }: Props) {
  const { data: session, status } = useSession();

  const [name, setName] = useState<Session['user']['name']>(
    AuthProviderLabels.anynymous,
  );
  const [email, setEmail] = useState<Session['user']['email']>(
    AuthProviderLabels.anynymous,
  );
  const [authProvider, setAuthProvider] = useState<
    Session['user']['authProvider']
  >(AuthProvider.DEFAULT);

  const convertAuthProvider = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.GOOGLE:
        return AuthProviderLabels.GOOGLE;
      case AuthProvider.KAKAO:
        return AuthProviderLabels.KAKAO;
      default:
        return AuthProviderLabels.anynymous;
    }
  };

  useEffect(() => {
    if (!isNull(session) && status === AUTHENTICATED) {
      setName(session?.user.name ?? AuthProviderLabels.anynymous);
      setEmail(session?.user.email ?? AuthProviderLabels.anynymous);
      setAuthProvider(
        session?.user.authProvider ?? AuthProviderLabels.anynymous,
      );
    }
  }, [session]);

  return (
    <section className={className}>
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
