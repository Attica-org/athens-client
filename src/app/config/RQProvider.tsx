'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';
import useApiError from '@/hooks/useApiError';
import NetworkErrorNotification from '../_components/utils/NetworkErrorNotification';

type Props = {
  children: React.ReactNode;
};

export default function RQProvider({ children }: Props) {
  const { isNetworkOffline } = useNetworkStatus();
  const { handleError } = useApiError();

  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          networkMode: 'always',
          refetchOnWindowFocus: false,
          retry: 2,
          retryOnMount: true,
          refetchOnReconnect: true,
        },
        mutations: {
          onError: async (error) => {
            await handleError(error);
          },
          networkMode: 'always',
          retry: 1,
        },
      },
      queryCache: new QueryCache({
        onError: async (error, query) => {
          const { queryKey } = query;
          await handleError(error, undefined, queryKey);
        },
      }),
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
