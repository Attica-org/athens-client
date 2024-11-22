// middleware.ts
import { NextResponse } from 'next/server';
import { getSession } from './serverActions/auth';
import isNull from './utils/validation/validateIsNull';

export async function middleware() {
  const session = await getSession();

  if (isNull(session)) {
    return NextResponse.redirect(`${process.env.NEXT_CLIENT_URL}/`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/agoras', '/flow/:path*', '/create-agora', '/user-info'],
};
