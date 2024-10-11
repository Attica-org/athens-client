import { useRef } from 'react';

export default function useTouchHandler(
  onLongPress: () => void,
  delay: number = 500,
) {
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      onLongPress();
    }, delay);
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleTouchCancel = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  return { handleTouchStart, handleTouchEnd, handleTouchCancel };
}
