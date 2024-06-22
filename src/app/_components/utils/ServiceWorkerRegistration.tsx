'use client';

import showToast from '@/utils/showToast';
import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    const getRegisterServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistrations();

        const customSwUrl = '/custom-sw.js';
        let needsRegistration = true;

        registration.some((regist) => {
          if (regist.active && regist.active.scriptURL.includes(customSwUrl)) {
            needsRegistration = false;
            // console.log('Custom SW already registered: ', regist);
            return true;
          }
          return false;
        });

        if (needsRegistration) {
          if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // console.log('ServiceWorkerRegistration 실행');
            try {
              navigator.serviceWorker
                .register('/custom-sw.js')
                .then(() => {
                  // registration
                  // console.log('Custom SW registered: ', regist);
                })
                .catch(() => {
                  // registrationError
                  // console.log('SW registration failed: ', registrationError);
                });
            } catch (error) {
              // console.log('error', error);
            }
          }
        }
      } catch (registrationError) {
        showToast(
          'Service Worker 등록에 실패했습니다. 잠시 후 다시 시도해주세요.',
          'error',
        );
        // console.log('registration failed: ', registrationError);
      }
    };

    getRegisterServiceWorker();
  }, []);

  return null;
}
