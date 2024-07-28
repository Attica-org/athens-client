'use client';

import showToast from '@/utils/showToast';
import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    const customSwUrl = '/custom-sw.js';

    function monitorServiceWorker(worker: ServiceWorker) {
      if (worker) {
        // Service Worker 상태 변경 감지
        worker.addEventListener('statechange', async (e: Event) => {
          const sw = e.target as ServiceWorker;

          // Service Worker 상태가 redundant가 되면 다시 등록
          if (sw.state === 'redundant') {
            try {
              await navigator.serviceWorker.register(customSwUrl);
            } catch (error) {
              showToast(
                'Service Worker 등록 실패로 일부 기능이 동작하지 않을 수 있습니다. 잠시 후 다시 시도해주세요.',
                'error',
              );
            }
          }
        });
      }
    }

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.getRegistrations();
        let needsRegistration = true;

        registration.some((regist) => {
          if (regist.active && regist.active.scriptURL.includes(customSwUrl)) {
            needsRegistration = false;
            monitorServiceWorker(regist.active);

            return true;
          }
          return false;
        });

        if (needsRegistration) {
          if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            try {
              const regist =
                await navigator.serviceWorker.register(customSwUrl);

              if (regist.installing) {
                monitorServiceWorker(regist.installing);
              } else if (regist.waiting) {
                monitorServiceWorker(regist.waiting);
              } else if (regist.active) {
                monitorServiceWorker(regist.active);
              }
            } catch (error) {
              showToast(
                'Service Worker 등록 실패로 일부 기능이 동작하지 않을 수 있습니다. 잠시 후 다시 시도해주세요.',
                'error',
              );
            }
          }
        }
      } catch (registrationError) {
        showToast(
          'Service Worker 등록 실패로 일부 기능이 동작하지 않을 수 있습니다. 잠시 후 다시 시도해주세요.',
          'error',
        );
      }
    }

    registerServiceWorker();

    // Service Worker가 업데이트 되면 서비스워커 모니터링하여 서비스워커 체크 및 재등록 로직 실행
    // navigator.serviceWorker.oncontrollerchange = () => {
    //   const { controller } = navigator.serviceWorker;
    //   if (controller) {
    //     monitorServiceWorker(controller);
    //   }
    // };
  }, []);

  return null;
}
