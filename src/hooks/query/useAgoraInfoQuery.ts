import { getAgoraTitle } from '@/app/(main)/_lib/getAgoraTitle';
import { AgoraId } from '@/app/model/Agora';
import { getSelectedAgoraQueryKey } from '@/constants/queryKey';
import { useQuery } from '@tanstack/react-query';

type AgoraInfoQueryArg = {
  enabled: boolean;
  agoraId: AgoraId;
};

export const useAgoraInfoQuery = ({ enabled, agoraId }: AgoraInfoQueryArg) => {
  return useQuery({
    queryKey: getSelectedAgoraQueryKey(agoraId.toString()),
    queryFn: getAgoraTitle,
    enabled,
  });
};
