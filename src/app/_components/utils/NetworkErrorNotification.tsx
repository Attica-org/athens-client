'use client';

import showToast from '@/utils/showToast';
import { useEffect } from 'react';

export default function NetworkErrorNotification() {
  useEffect(() => {
    showToast('네트워크 연결이 끊겼습니다.', 'error');
  }, []);

  return null;
}
