import { isServiceWorkerActive } from './validation/validateIsServiceWorkerActive';

type Props = {
  action: string;
  data: any;
};

export const postServiceWorkerMessage = ({ action, data }: Props) => {
  if (isServiceWorkerActive()) {
    const controller = navigator.serviceWorker.controller!;
    controller.postMessage({
      action,
      data,
    });
  }
};
