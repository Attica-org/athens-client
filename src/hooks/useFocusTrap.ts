import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  closeIcon: boolean,
) {
  const router = useRouter();

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const focusableEls = container.querySelectorAll<HTMLElement>(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
          'textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.key === 'Tab') {
        const isFirstFocused = document.activeElement === first;
        const isLastFocused = document.activeElement === last;

        if (e.shiftKey && isFirstFocused) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && isLastFocused) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === 'Escape' && closeIcon) {
        router.back();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [containerRef]);
}
