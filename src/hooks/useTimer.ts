import { AgoraConfig, AgoraStartResponse } from '@/app/model/Agora';
import { differenceInSeconds } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';

type Time = AgoraConfig['duration'];

const useTimer = (
  startTime: AgoraStartResponse['startTime'],
  duration: Time,
) => {
  const [remainingTime, setRemainingTime] = useState<Time>(duration * 60);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const intervalId = useRef<number | null>(null);

  const setTimerLabel = (time: Time) => {
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
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    } else {
      setRemainingTime(remainTime);
    }
  }, [startTime, duration, intervalId]);

  useEffect(() => {
    if (startTime) {
      // 초기 실행 시의 지연 계산
      calculateRemaining();
      if (remainingTime > 0) {
        intervalId.current = window.setInterval(calculateRemaining, 1000);
      }
    } else {
      setRemainingTime(duration * 60);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, duration, calculateRemaining, remainingTime]);

  const resetTimer = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
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
