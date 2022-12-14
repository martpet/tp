import { useEffect, useState } from 'react';

export function useIsOffline() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const offlineListener = () => setIsOffline(true);
    const onlineListener = () => setIsOffline(false);

    window.addEventListener('offline', offlineListener);
    window.addEventListener('online', onlineListener);

    return () => {
      window.removeEventListener('offline', offlineListener);
      window.removeEventListener('online', onlineListener);
    };
  }, []);

  return isOffline;
}
