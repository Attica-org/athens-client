import type { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

interface Authorize {
  accessToken?: string;
}

type ExtendedUser = User & {
  accessToken: string;
  id: string;
};

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      authorize: async (credentials: Authorize) => {
        const { accessToken } = credentials;
        let user: User = {
          accessToken: '',
          authProvider: '',
          name: '',
          email: '',
        };

        // 토큰이 있는 경우, 회원가입!
        if (accessToken) {
          const response = await fetch(
            `${process.env.NEXT_BASE_URL}/api/v1/auth/member/info`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              credentials: 'include',
            },
          );

          const result = await response.json();

          // 로그인 실패
          if (!result.success && !response.ok) {
            throw new Error('FAILED TO LOGIN');
          }

          user = {
            accessToken,
            authProvider: result.response.authProvider,
            name: result.response.nickname,
            email: result.response.email,
          };
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // JSON Web Token 사용
    maxAge: 60 * 60 * 24, // 세션 만료 시간(sec), refresh token 만료시간과 동일하게 적용
  },
  pages: {
    signIn: '/',
    signOut: '/',
  },
  callbacks: {
    signIn: async ({ user }) => {
      // 로그인 시에만 호출
      if (user && (user as ExtendedUser).accessToken) return true;
      return false;
    },
    jwt: async ({ token, user, trigger, session }) => {
      // user 객체가 없다는 것은 단순 세션 조회를 위한 요청
      // user 객체가 있다는 것은 로그인 시도
      if (user?.accessToken) {
        const extendedUser = user as ExtendedUser;

        const newJwtToken = {
          ...token,
          accessToken: extendedUser.accessToken,
          name: extendedUser.name || 'anonymous',
          email: extendedUser.email || 'anonymous',
          authProvider: extendedUser.authProvider,
          id: extendedUser.id,
        };

        return newJwtToken;
      }

      // update 시에만 session이 존재
      // accessToken 만료로 인한 갱신, 기존 세션에 새로운 토큰을 반영
      if (trigger === 'update') {
        console.log('update session', session);
        console.log('current jwt', token);
        const newJwtToken = {
          ...token,
          accessToken: session.user.accessToken,
        };

        return newJwtToken;
      }

      // session에 저장할 정보를 반환
      return token;
    },
    session: async ({ session, token }) => {
      console.log('session', session);
      if (token && session.user.accessToken !== token.accessToken) {
        // jwt callback에서 반환받은 token 값을 기존 세션에 추가한다.
        const newSession = {
          ...session,
          user: {
            ...session.user,
            accessToken: token.accessToken,
            name: token.name,
            email: token.email,
            authProvider: token.authProvider,
          },
        };

        return newSession;
      }

      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url) {
        const { search, origin, pathname } = new URL(url);
        const callbackUrl = new URLSearchParams(search).get('callbackUrl');

        if (callbackUrl) {
          return callbackUrl.startsWith('/')
            ? `${baseUrl}${callbackUrl}`
            : callbackUrl;
        }

        // 로그인 성공 시 리다이렉트할 페이지
        if (pathname === '/login/auth' || pathname === '/') {
          return `${baseUrl}/home`;
        }

        if (origin === baseUrl) return url;
      }

      return baseUrl;
    },
  },
  // JWT 암호화 키
  secret: process.env.AUTH_SECRET,
};
