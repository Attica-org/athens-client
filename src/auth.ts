import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
  unstable_update: update, // Beta
} = NextAuth(authConfig);
