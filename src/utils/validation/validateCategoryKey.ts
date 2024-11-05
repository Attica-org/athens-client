import { AGORACATEGORY } from '@/constants/consts';

type CategoryKey = keyof typeof AGORACATEGORY;

export function isValidCategoryKey(key: string | number): key is CategoryKey {
  return key in AGORACATEGORY;
}
