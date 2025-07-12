import postLogout from '@/app/(main)/user-info/_lib/postLogout';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import useApiError from '../useApiError';

export const useLogoutMutation = () => {
  const { handleError } = useApiError();

  const logoutMutation = useMutation({
    mutationFn: async () => postLogout(),
    onSuccess: async () => {
      await signOut({ redirect: true });
    },
    onError: async (error) => {
      await handleError(error, logoutMutation.mutate);
    },
  });

  return logoutMutation;
};
