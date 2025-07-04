import { postEnterClosedAgora } from '@/app/(main)/_lib/postEnterClosedAgora';
import { AgoraId, EnterClosedAgoraResponse } from '@/app/model/Agora';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

type EnterClosedAgoraMutationArg = {
  agoraId: AgoraId;
  options: UseMutationOptions<EnterClosedAgoraResponse, Error>;
};

export const useEnterClosedAgoraMutation = ({
  agoraId,
  options,
}: EnterClosedAgoraMutationArg) => {
  const enterClosedAgoraMutation = useMutation({
    mutationFn: () => postEnterClosedAgora(agoraId),
    ...options,
  });

  return { enterClosedAgoraMutation };
};
