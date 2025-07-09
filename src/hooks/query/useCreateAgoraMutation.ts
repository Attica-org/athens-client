import { postCreateAgora } from '@/app/(main)/_lib/postCreateAgora';
import { AgoraConfig, CreateAgoraResponse } from '@/app/model/Agora';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

type CreateAgoraMutationArg = {
  agoraInfo: AgoraConfig;
  options: UseMutationOptions<CreateAgoraResponse, Error>;
};

export const useCreateAgoraMutation = ({
  agoraInfo,
  options,
}: CreateAgoraMutationArg) => {
  return useMutation({
    mutationFn: () => postCreateAgora(agoraInfo),
    ...options,
  });
};
