export const isServiceWorkerActive = () => {
  return 'serviceWorker' in navigator && navigator.serviceWorker.controller;
};
