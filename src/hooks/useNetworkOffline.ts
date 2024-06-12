import { useEffect, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useNetworkOffline = () => {
  const [isNetworkOffline, setIsNetworkOffline] = useState(false);

  const handleOnOffLine = () => {
    setIsNetworkOffline(() => !window.navigator.onLine);
  };

  useEffect(() => {
    setIsNetworkOffline(!navigator.onLine);

    window.addEventListener('online', handleOnOffLine);
    window.addEventListener('offline', handleOnOffLine);

    return () => {
      window.removeEventListener('online', handleOnOffLine);
      window.removeEventListener('offline', handleOnOffLine);
    };
  }, []);

  return {
    isNetworkOffline,
  };
};
