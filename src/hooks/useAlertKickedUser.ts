import { useKickedStore } from '@/store/kick';
import { swalKickedUserAlert } from '@/utils/swalAlert';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const useAlertKickedUser = () => {
  const { kicked, reset } = useKickedStore(
    useShallow((state) => ({
      kicked: state.kicked,
      reset: state.reset,
    })),
  );

  useEffect(() => {
    const handleKicked = async () => {
      if (kicked) {
        const result = await swalKickedUserAlert();

        if (result && result.isConfirmed) {
          reset();
        }
      }
    };

    handleKicked();
  }, [kicked]);
};
