import {
  HydrationBoundary,
  dehydrate,
  useQueryClient,
} from '@tanstack/react-query';
import React from 'react';
import { getChatMessages } from '../../_lib/getChatMessages';
import Message from '../molecules/Message';

type Props = {
  agoraId: string;
};

export default async function MessageContainer({ agoraId }: Props) {
  const queryClient = useQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['chat', `${agoraId}`, 'messages'],
    queryFn: getChatMessages,
    initialPageParam: { meta: { key: null, effectiveSize: 20 } },
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Message />
    </HydrationBoundary>
  );
}
