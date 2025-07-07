import { AccessStatus } from '@/app/model/AccessStatus';
import { create } from 'zustand';

interface State {
  hasError: boolean;
  type: AccessStatus | null;
}

interface Action {
  setErrorType(type: AccessStatus): void;
  setHasError(hasError: boolean): void;
  reset(): void;
}

const initialState = {
  hasError: false,
  type: null,
};

export const useErrorStore = create<State & Action>((set) => ({
  ...initialState,
  setHasError: (hasError) => {
    set({ hasError });
  },
  setErrorType: (type) => {
    set({ hasError: true, type });
  },
  reset: () => {
    set({
      hasError: false,
      type: null,
    });
  },
}));
