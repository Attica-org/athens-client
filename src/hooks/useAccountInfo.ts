import {
  AUTHENTICATED,
  AuthProvider,
  AuthProviderLabels,
} from '@/constants/auth';
import isNull from '@/utils/validation/validateIsNull';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useAccountInfo = () => {
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

  return {
    name,
    email,
    authProvierLabel: convertAuthProvider(authProvider),
  };
};
