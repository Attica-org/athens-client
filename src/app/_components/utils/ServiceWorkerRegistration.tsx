'use client';

import showToast from '@/utils/showToast';
import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    const registerServiceWorker = async () => {
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
                .register(customSwUrl)
                .then(() => {
                  // registration
                  // console.log('Custom SW registered: ', regist);
                })
                .catch(() => {
                  // registrationError
                  // console.log('SW registration failed: ', registrationError);
                });
            } catch (error) {
              showToast(
                'Service Worker 등록에 실패했습니다. 잠시 후 다시 시도해주세요.',
                'error',
              );
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

    const monitorServiceWorker = () => {
      navigator.serviceWorker.ready.then(() => {
        // 서비스 워커 active, ready
        navigator.serviceWorker.oncontrollerchange = () => {
          if (!navigator.serviceWorker.controller) {
            // 서비스 워커가 동작하지 않고 있기 때문에 재등록
            registerServiceWorker();
          }
        };
      });
    };

    registerServiceWorker();
    monitorServiceWorker();
  }, []);

  return null;
}
