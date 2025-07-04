import { useEffect } from 'react';
import { useAgora } from '@/store/agora';
import { AgoraId } from '@/app/model/Agora';
import { useAgoraInfoQuery } from './query/useAgoraInfoQuery';

type EnterAgoraSetInfoArg = {
  enabled: boolean;
  agoraId: AgoraId;
  selectedAgoraId: AgoraId;
};

export const useEnterAgoraSetInfo = ({
  enabled,
  agoraId,
  selectedAgoraId,
}: EnterAgoraSetInfoArg) => {
  const { data, isSuccess, isError } = useAgoraInfoQuery({ enabled, agoraId });

  useEffect(() => {
    if (isSuccess && data && !selectedAgoraId) {
      useAgora.getState().setSelectedAgora({
        id: Number(agoraId),
        imageUrl: data.imageUrl,
        agoraTitle: data.title,
        status: data.status,
        agoraColor: data.agoraColor,
      });
    }
  }, [agoraId, data, isError, isSuccess, selectedAgoraId]);

  return { isSuccess, isError };
};
