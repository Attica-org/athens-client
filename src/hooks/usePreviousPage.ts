'use client';

import {
  STORAGE_CURRENT_URL_KEY,
  STORAGE_PREVIOUSE_URK_KEY,
} from '@/constants/segmentKey';
import isNull from '@/utils/validation/validateIsNull';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function usePreviousPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storage = sessionStorage;
    const currentUrl =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    const previousUrl = storage.getItem(STORAGE_CURRENT_URL_KEY);

    if (!isNull(previousUrl)) {
      storage.setItem(STORAGE_PREVIOUSE_URK_KEY, previousUrl);
    }

    storage.setItem(STORAGE_CURRENT_URL_KEY, currentUrl);
  }, [pathname, searchParams]);

  return null;
}
