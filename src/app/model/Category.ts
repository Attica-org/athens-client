export interface Category {
  id: number;
  innerText: string;
  isActive: boolean;
}

export type CategoryItems = {
  readonly [key: string | number]: {
    readonly innerText: string;
    readonly value: string;
  };
};
