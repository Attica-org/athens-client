'use client';

import React from 'react';
import { useAccountInfo } from '@/hooks/useAccountInfo';
import AccountInfo from '../atoms/AccountInfo';

type Props = {
  className?: string;
};

export default function AccountInfos({ className }: Props) {
  const { name, email, authProvierLabel } = useAccountInfo();

  return (
    <section className={className}>
      <AccountInfo label="이름" content={name} className="mb-10" />
      <AccountInfo
        label="이메일"
        content={email}
        className="mb-10 items-center justify-center"
      />
      <AccountInfo label="소셜로그인" content={authProvierLabel} />
    </section>
  );
}
