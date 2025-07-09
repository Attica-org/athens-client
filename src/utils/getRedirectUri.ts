import { Provider } from '@/constants/auth';
import isNull from './validation/validateIsNull';

type GetRedirectUriArg = {
  provider: Provider;
  callbackUrl: undefined | string;
};

export const getRedirectUri = ({
  provider,
  callbackUrl,
}: GetRedirectUriArg) => {
  let redirectUri = `${process.env.NEXT_PUBLIC_CLIENT_URL}/login`;
  if (!isNull(callbackUrl)) {
    redirectUri += `?callbackUrl=${callbackUrl}`;
  }
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  const finalUrl = `${process.env.NEXT_BASE_URL}/oauth2/authorization/${provider}?redirect_uri=${encodedRedirectUri}`;
  return finalUrl;
};
