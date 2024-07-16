import { useEffect } from 'react';

export const useOnWindowResize = (handler: { (): void }) => {
  useEffect(() => {
    if (window === undefined) return;
    const handleResize = () => {
      handler();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handler]);
};
