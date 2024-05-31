import { differenceInSeconds } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

const useTimer = (startTime: string, duration: number, start: boolean) => {
  const [remainingTime, setRemainingTime] = useState<number>(duration * 60);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const setTimerLabel = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const calculateRemaining = useCallback(() => {
    const diffTime = differenceInSeconds(new Date(), new Date(startTime)); // s 차이

    const remainTime = duration * 60 - diffTime;

    if (remainTime <= 0) {
      setIsFinished(true);
      setRemainingTime(0);
      if (intervalId) {
        clearInterval(intervalId);
      }
    } else {
      setRemainingTime(remainTime);
    }

    // return setTimerLabel(remainTime);
  }, [startTime, duration, intervalId]);

  useEffect(() => {
    let initialTimeout: NodeJS.Timeout;
    const initiateTimer = () => {
      const id = window.setInterval(() => {
        calculateRemaining();
      }, 1000);
      setIntervalId(id);
    };

    if (start) {
      // 초기 실행 시의 지연 계산
      const diffTime = differenceInSeconds(new Date(), new Date(startTime));
      const delayForNextSecond = diffTime;
      initialTimeout = setTimeout(() => {
        calculateRemaining();
        initiateTimer();
      }, delayForNextSecond);
    }

    return () => {
      clearTimeout(initialTimeout);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [startTime, duration, intervalId, calculateRemaining, start]);

  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setRemainingTime(duration * 60);
    setIsFinished(false);
  };

  return {
    formattedTime: setTimerLabel(remainingTime),
    isFinished,
    resetTimer,
  };
};

export default useTimer;
