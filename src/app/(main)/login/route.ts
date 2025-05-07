import isNull from '@/utils/validation/validateIsNull';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('temp-token');
  const callbackUrl = searchParams.get('callbackUrl');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_CLIENT_URL}/`);
  }

  if (!isNull(callbackUrl)) {
    return NextResponse.redirect(
      `${origin}/login/auth?user=${token}&callbackUrl=${callbackUrl}`,
    );
  }
  return NextResponse.redirect(`${origin}/login/auth?user=${token}`);
}
