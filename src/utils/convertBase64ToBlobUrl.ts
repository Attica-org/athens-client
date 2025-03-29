import isNull from './validation/validateIsNull';

export const convertBase64ToBlobUrl = (base64: string) => {
  const base64Data = base64.split(',')[1]?.replace(/[\s\n]/g, ''); // "data:image/jpeg;base64," 제거
  if (isNull(base64Data)) {
    return '';
  }

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(null)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
};
