import React from 'react';
import SignIn from '../../_components/templates/SignIn';
import AuthLogin from './components/AuthLogin';

type Props = {
  searchParams: {
    user: string;
  };
};

export default function LoginConfirm({ searchParams }: Props) {
  const { user } = searchParams;

  return (
    <div>
      <SignIn />
      <AuthLogin user={user} />
    </div>
  );
}
