import 'next-auth';
import '@auth/core/jwt';
import { AUTHENTICATED, AuthProvider, UNAUTHENTICATED } from '@/constants/auth';

export declare module 'next-auth' {
  interface User {
    accessToken: string;
    authProvider: AuthProvider;
    name: string;
    email: string;
  }

  interface Session {
    user: {
      accessToken: string;
      authProvider: AuthProvider;
      name: string;
      email: string;
    };
    status: typeof AUTHENTICATED | typeof UNAUTHENTICATED;
  }
}

export declare module '@auth/core/jwt' {
  interface JWT {
    email: string | null;
    accessToken: string;
    authProvider: AuthProvider;
  }
}
