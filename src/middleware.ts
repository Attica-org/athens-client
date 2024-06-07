// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
