import { useAgora } from '@/store/agora';
import { useCallback, useState } from 'react';
import {
  ClosedAgora,
  CategoryAgora,
  ParticipantPosition,
} from '@/app/model/Agora';
import { useEnterClosedAgoraMutation } from './query/useEnterClosedAgoraMutation';
import useApiError from './useApiError';

type EnterClosedAgoraActionArg = {
  routeAgoraPage: (path: string) => void;
  agora: CategoryAgora | ClosedAgora;
};

export const useEnterClosedAgoraAction = ({
  routeAgoraPage,
  agora,
}: EnterClosedAgoraActionArg) => {
  const { setSelectedAgora, setEnterAgora } = useAgora();
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useApiError();

  const setSelectAgoraData = useCallback(() => {
    setSelectedAgora({
      id: agora.id,
      imageUrl: agora.imageUrl,
      agoraTitle: agora.agoraTitle,
      status: agora.status,
      agoraColor: agora.agoraColor,
    });
  }, [setSelectedAgora]);

  const { enterClosedAgoraMutation } = useEnterClosedAgoraMutation({
    agoraId: agora.id,
    options: {
      onMutate: () => {
        setIsLoading(true);
      },
      onSuccess: () => {
        setIsLoading(false);
        setSelectAgoraData();
        setEnterAgora({
          id: agora.id,
          userId: 0,
          imageUrl: agora.imageUrl,
          agoraTitle: agora.agoraTitle,
          status: agora.status,
          role: ParticipantPosition.OBSERVER,
          isCreator: false,
          agoraColor: agora.agoraColor,
        });
        routeAgoraPage(`/agoras/${agora.id}`);
      },
      onError: async (error) => {
        setIsLoading(false);
        await handleError(error, enterClosedAgoraMutation.mutate);
      },
    },
  });

  return {
    isLoading,
    setSelectAgoraData,
    enterClosedAgoraMutation,
  };
};
