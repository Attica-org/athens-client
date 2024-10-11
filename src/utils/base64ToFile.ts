export const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n) {
    u8arr[n] = bstr.charCodeAt(n);
    n -= 1;
  }

  return new File([u8arr], filename, { type: mime });
};
