import { useEffect } from 'react';

import { isOnSeverSide } from '@/utils';

export const useOnWindowResize = (handler: { (): void }) => {
  useEffect(() => {
    if (isOnSeverSide) return;
    const handleResize = () => {
      handler();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handler]);
};
