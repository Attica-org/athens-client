export const calculatePopupPosition = (
  clientRect: DOMRect,
): 'bottom' | 'top' => {
  const popupTop = clientRect.top;
  const popupBottom = window.innerHeight - clientRect.bottom;

  if (popupTop < popupBottom) {
    return 'bottom';
  }
  return 'top';
};
