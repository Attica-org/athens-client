export const AGORACATEGORY = {
  '1': { innerText: '전체', value: '1' },
  '2': { innerText: '사회/복지', value: '2' },
  '3': { innerText: '지식/공부', value: '3' },
  '4': { innerText: '문화/예술', value: '4' },
  '5': { innerText: '음식/여행', value: '5' },
  '6': { innerText: '일상/취미', value: '6' },
} as const;

export const PROFLELIST = [
  { id: 1, name: '도끼 든 회색 곰', file: 'bear.png' },
  { id: 2, name: '노트북 하는 병아리', file: 'chick.png' },
  { id: 3, name: '안경 쓴 기린', file: 'giraffe.png' },
  { id: 4, name: '책 읽는 코알라', file: 'koala.png' },
  { id: 5, name: '총 든 토끼', file: 'rabbit.png' },
  { id: 6, name: '선글라스 쓴 고양이', file: 'cat.png' },
  { id: 7, name: '조개 든 수달', file: 'otter.png' },
] as const;

export type ColorValue = (typeof COLOR)[number]['value'];

export const COLOR = [
  { value: 'bg-agora-point-color1', label: '청록색' },
  { value: 'bg-agora-point-color2', label: '밝은 민트색' },
  { value: 'bg-agora-point-color3', label: '연한 갈색' },
  { value: 'bg-agora-point-color4', label: '연한 주황색' },
  { value: 'bg-agora-point-color5', label: '연한 핑크색' },
  { value: 'bg-agora-point-color6', label: '남색' },
] as const;
