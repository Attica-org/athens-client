export const AGORACATEGORY = {
  '1': { innerText: '전체', value: '1' },
  '2': { innerText: '사회/복지', value: '2' },
  '3': { innerText: '지식/공부', value: '3' },
  '4': { innerText: '문화/예술', value: '4' },
  '5': { innerText: '음식/여행', value: '5' },
  '6': { innerText: '일상/취미', value: '6' },
} as const;

type CategoryKey = keyof typeof AGORACATEGORY;

export function isValidCategoryKey(key: string): key is CategoryKey {
  return key in AGORACATEGORY;
}
