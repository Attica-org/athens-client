'use client';

import confetti from 'canvas-confetti';
import React, { useEffect, useRef } from 'react';

export default function ConfettiButton2() {
  const duration = 35 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
  };
  const intervalId = useRef<NodeJS.Timeout>();

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const handleConfetti = () => {
    intervalId.current = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    handleConfetti();

    return () => {
      clearInterval(intervalId.current);
    };
  });

  return <div />;
}
