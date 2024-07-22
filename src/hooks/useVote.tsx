import swManager from '@/utils/swManager';
import { useEffect, useState } from 'react';

const useVote = () => {
  const [vote, setVote] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'updateVote',
        data: vote,
        tabId: swManager.getTabId(),
      });
    }
  }, [vote]);

  return [vote, setVote];
};

export default useVote;
