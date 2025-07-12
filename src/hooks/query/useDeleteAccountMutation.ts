import deleteUserAccount from '@/app/(main)/user-info/_lib/deleteUserAccount';
import { swalDeleteAccountSuccessAlert } from '@/utils/swalAlert';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import useApiError from '../useApiError';

export const useDeleteAccountMutation = () => {
  const { handleError } = useApiError();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => deleteUserAccount(),
    onSuccess: async () => {
      await swalDeleteAccountSuccessAlert().then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          signOut({ redirect: true });
        }
      });
    },
    onError: async (error) => {
      await handleError(error, () => deleteAccountMutation.mutate());
    },
  });

  return deleteAccountMutation;
};
