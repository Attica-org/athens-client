// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import tokenManager from './utils/tokenManager';
import { getSession } from './serverActions/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(`${process.env.NEXT_CLIENT_URL}/`);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  // 공유를 통해 들어온 유저는 referer가 없기 때문에
  // referer가 없으며 nextUrl.pathname이 agoras로 시작하면 토큰이 있는지 확인하고 없으면 입장하기 모달 페이지로 이동
  if (
    request.headers.get('referer') === null &&
    request.nextUrl.pathname.split('/')[1] === 'agoras'
  ) {
    const refererPathname = request.nextUrl.pathname;
    const agoraId = refererPathname.split('/')[2];

    const token = tokenManager.getToken();

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_CLIENT_URL}/flow/enter-agora/${agoraId}`,
      );
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/agoras', '/flow/:path*', '/create-agora', '/user-info'],
};
