import React, { useEffect, useState } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import DesktopBlocker from './components/DesktopBlocker';
import MobileLayout from './components/MobileLayout';
import CloneLayout from './components/CloneLayout';
import ChatPage from './components/ChatPage';

// Resolve the current route from the hash (e.g. /#/1) or the path (e.g. /1).
function getRoute(): string {
  const hash = window.location.hash.replace(/^#/, '');
  const raw = (hash || window.location.pathname).replace(/\/+$/, '');
  return raw || '/';
}

function App() {
  const isMobile = useIsMobile();
  const [route, setRoute] = useState<string>(getRoute());

  useEffect(() => {
    const onNav = () => setRoute(getRoute());
    window.addEventListener('popstate', onNav);
    window.addEventListener('hashchange', onNav);
    return () => {
      window.removeEventListener('popstate', onNav);
      window.removeEventListener('hashchange', onNav);
    };
  }, []);

  useEffect(() => {
    if (route === '/separate') {
      console.log('SnapSpy: Running on /separate route (Duplicate Mode)');
    }
  }, [route]);

  // Standalone Snapchat-style chat demo page.
  if (route === '/1') {
    return <ChatPage />;
  }

  // For production, if !isMobile render DesktopBlocker.
  if (!isMobile) {
    return <DesktopBlocker />;
  }

  // Clone of the main page.
  if (route === '/clone') {
    return <CloneLayout />;
  }

  return <MobileLayout />;
}

export default App;
