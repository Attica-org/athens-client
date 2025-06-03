'use server';

import { THEME, THEME_KEY, THEME_MAINTENANCE } from '@/constants/theme';
import { cookies } from 'next/headers';

function hasThemeCookie() {
  const cookieStore = cookies();
  return cookieStore.has(THEME_KEY);
}

export async function getThemeValue(): Promise<THEME> {
  if (hasThemeCookie()) {
    const theme = cookies().get(THEME_KEY)?.value;
    return theme as THEME;
  }
  return THEME.LIGHT;
}

export async function toggleThemeValue(): Promise<THEME> {
  const theme = await getThemeValue();
  if (theme === THEME.DARK) {
    cookies().set(THEME_KEY, THEME.LIGHT, {
      path: '/',
      maxAge: THEME_MAINTENANCE,
    });
    return THEME.LIGHT;
  }
  if (theme === THEME.LIGHT) {
    cookies().set(THEME_KEY, THEME.DARK, {
      path: '/',
      maxAge: THEME_MAINTENANCE,
    });
    return THEME.DARK;
  }

  return THEME.LIGHT;
}
