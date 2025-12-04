import React, { useEffect } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import DesktopBlocker from './components/DesktopBlocker';
import MobileLayout from './components/MobileLayout';

function App() {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Log current route for debugging purposes
    const currentPath = window.location.pathname;
    if (currentPath === '/separate') {
      console.log('SnapSpy: Running on /separate route (Duplicate Mode)');
    }
  }, []);

  // For production, if !isMobile render DesktopBlocker.
  if (!isMobile) {
    return <DesktopBlocker />;
  }

  return <MobileLayout />;
}

export default App;