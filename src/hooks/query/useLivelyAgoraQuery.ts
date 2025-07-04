import { getLivelyAgora } from '@/app/(main)/_lib/getLivelyAgora';
import { ActiveAgora } from '@/app/model/Agora';
import { QueryClient, useQuery } from '@tanstack/react-query';

type LivelyAgoraQueryArg = {
  queryClient: QueryClient;
};

export const useLivelyAgoraQuery = ({ queryClient }: LivelyAgoraQueryArg) => {
  return useQuery<ActiveAgora[], Object, ActiveAgora[], [string, string]>({
    queryKey: ['agoras', 'lively'],
    queryFn: getLivelyAgora,
    initialData: () => {
      return queryClient.getQueryData(['agoras', 'lively']);
    },
  });
};
