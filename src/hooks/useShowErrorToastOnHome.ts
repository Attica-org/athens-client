import { useErrorStore } from '@/store/error';
import { swalShowErrorAlert } from '@/utils/swalAlert';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const useShowErrorToastOnHome = () => {
  const { type, hasError, reset } = useErrorStore(
    useShallow((state) => ({
      type: state.type,
      hasError: state.hasError,
      reset: state.reset,
    })),
  );

  useEffect(() => {
    const handleKicked = async () => {
      if (hasError && type) {
        const result = await swalShowErrorAlert(type);

        if (result && result.isConfirmed) {
          reset();
        }
      }
    };

    handleKicked();
  }, [hasError, type, reset]);
};
