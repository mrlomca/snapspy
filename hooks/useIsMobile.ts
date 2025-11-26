import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(true); // Default to mobile to avoid flash on mobile devices

  useEffect(() => {
    const checkMobile = () => {
      // Check if width is less than typical tablet/desktop breakpoint (e.g., 768px or 1024px)
      // For this specific 'mobile only' requirement, we usually want to force phones.
      const isMobileWidth = window.innerWidth <= 768;
      
      // Optional: Check user agent if strictly enforcing mobile OS
      // const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      // const isMobileUA = /android|ipad|iphone|ipod/i.test(userAgent);
      
      setIsMobile(isMobileWidth);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};