'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
// import { useQueryError } from '@/hooks/useQueryError';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';
import NetworkErrorNotification from './NetworkErrorNotification';

type Props = {
  children: React.ReactNode;
};

export default function RQProvider({ children }: Props) {
  const { isNetworkOffline } = useNetworkStatus();
  // const { handleError } = useQueryError();

  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          networkMode: 'online',
          refetchOnWindowFocus: false,
          retry: 2,
          retryOnMount: true,
          refetchOnReconnect: true,
        },
      },
      // queryCache: new QueryCache({
      //   onError: handleError,
      // }),
    }),
  );

  return (
    <QueryClientProvider client={client}>
      {isNetworkOffline && <NetworkErrorNotification />}
      {children}
      <ReactQueryDevtools
        initialIsOpen={process.env.NODE_ENV === 'development'}
      />
    </QueryClientProvider>
  );
}
