import React from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import DesktopBlocker from './components/DesktopBlocker';
import MobileLayout from './components/MobileLayout';

function App() {
  const isMobile = useIsMobile();

  // If you want to test the desktop view on mobile, change this condition temporarily.
  // For production, if !isMobile render DesktopBlocker.
  
  if (!isMobile) {
    return <DesktopBlocker />;
  }

  return <MobileLayout />;
}

export default App;