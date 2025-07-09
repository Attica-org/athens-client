import { useState } from 'react';
import { AgoraConfig } from '@/app/model/Agora';
import { useSearchStore } from '@/store/search';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import { useAgora } from '@/store/agora';
import { QueryClient, UseMutateFunction } from '@tanstack/react-query';
import { enterAgoraSegmentKey } from '@/constants/segmentKey';
import { AGORA_STATUS } from '@/constants/agora';
import { COLOR } from '@/constants/consts';
import { useCreateAgoraMutation } from './query/useCreateAgoraMutation';
import useApiError from './useApiError';

type CreateAgoraActionArg = {
  routeAgoraPage: (path: string) => void;
  queryClient: QueryClient;
  resetUploadImageState: () => void;
};

export const useCreateAgoraAction = ({
  routeAgoraPage,
  queryClient,
  resetUploadImageState,
}: CreateAgoraActionArg) => {
  const { handleError } = useApiError();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createAgora, setCreateAgora] = useState<AgoraConfig>({
    title: '',
    imageUrl: '',
    category: '1',
    color: { idx: 0, value: COLOR[0].value },
    capacity: 5,
    duration: 60,
  });
  const { reset: searchReset } = useSearchStore(
    useShallow((state) => ({
      reset: state.reset,
    })),
  );
  const { reset } = useCreateAgora(
    useShallow((state) => ({
      reset: state.reset,
    })),
  );
  const { setSelectedAgora } = useAgora(
    useShallow((state) => ({
      setSelectedAgora: state.setSelectedAgora,
    })),
  );

  const failedCreateAgora = async (
    error: Error,
    mutation: UseMutateFunction<any, Error, void, unknown>,
  ) => {
    setIsLoading(false);
    await handleError(error, mutation);
  };

  const mutation = useCreateAgoraMutation({
    agoraInfo: { ...createAgora },
    options: {
      onMutate: () => {
        setIsLoading(true);
      },
      onSuccess: async (response) => {
        reset();
        searchReset();
        resetUploadImageState();

        if (!isNull(response)) {
          setSelectedAgora({
            id: response.id,
            imageUrl: createAgora.imageUrl,
            agoraTitle: createAgora.title,
            status: AGORA_STATUS.QUEUED,
            agoraColor: createAgora.color.value,
          });

          setIsLoading(false);

          await queryClient.invalidateQueries({ queryKey: ['agora'] });
          routeAgoraPage(`/flow${enterAgoraSegmentKey}/${response.id}`);
          return;
        }

        // 요청은 성공했지만 정상적인 응답이 오지 않는다면 실패로 간주
        await failedCreateAgora(
          new Error('아고라 생성에 실패했습니다.'),
          mutation.mutate,
        );
      },
      onError: async (error) => {
        await failedCreateAgora(error, mutation.mutate);
      },
    },
  });

  return {
    isLoading,
    createAgoraMutation: mutation,
    setCreateAgora,
  };
};
