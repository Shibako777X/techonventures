import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { initializeOriginalPage } from '../../lib/originalBehaviors.js';

export default function Layout() {
  const containerRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') window.scrollTo(0, 0);
    return initializeOriginalPage(containerRef.current);
  }, [pathname]);

  return <div ref={containerRef}><Outlet /></div>;
}
