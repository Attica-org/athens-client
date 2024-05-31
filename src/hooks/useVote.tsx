import { useEffect, useState } from 'react';

const useVote = () => {
  const [vote, setVote] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'updateVote',
        data: vote,
      });
    }
  }, [vote]);

  return [vote, setVote];
};

export default useVote;
