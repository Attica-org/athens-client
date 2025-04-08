// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './serverActions/auth';
import isNull from './utils/validation/validateIsNull';

export async function middleware(req: NextRequest) {
  const session = await getSession();

  if (isNull(session)) {
    const redirectUrl = req.nextUrl.pathname + req.nextUrl.search;
    const loginUrl = new URL(`${process.env.NEXT_CLIENT_URL}/`);
    loginUrl.searchParams.set('callbackUrl', redirectUrl);
    // return NextResponse.redirect(`${process.env.NEXT_CLIENT_URL}/`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/agoras/:path*', '/flow/:path*', '/create-agora', '/user-info'],
};
