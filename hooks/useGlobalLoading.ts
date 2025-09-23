import { useState, useEffect } from 'react';

export const useGlobalLoading = (deps: boolean[]) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const busy = deps.some(Boolean);
    let timer: ReturnType<typeof setTimeout>;
    
    if (busy) {
      // Show loader after 350ms to avoid flash for quick operations
      timer = setTimeout(() => setVisible(true), 350);
    } else {
      // Hide immediately when not busy
      setVisible(false);
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [deps]);
  
  return visible;
};