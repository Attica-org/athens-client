import React from 'react';
import SignIn from '../../_components/templates/SignIn';
import AuthLogin from './components/AuthLogin';

type Props = {
  searchParams: {
    user: string;
    callbackUrl: string;
  };
};

export default function LoginConfirm({ searchParams }: Props) {
  const { user, callbackUrl } = searchParams;

  return (
    <div>
      <SignIn callbackUrl={callbackUrl ?? ''} />
      <AuthLogin user={user} callbackUrl={callbackUrl ?? ''} />
    </div>
  );
}
