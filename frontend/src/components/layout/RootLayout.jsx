import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from '../ui/Toast';
import SakuraBackground from '../common/SakuraBackground';
import AudioPlayer from '../common/AudioPlayer';
import CartDrawer from '../common/CartDrawer';
import CustomCakeStudioModal from '../common/CustomCakeStudioModal';
import AboutHoursModal from '../common/AboutHoursModal';

export function RootLayout() {
  const theme = useSelector((state) => state.ui?.theme || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'var(--cherry-void)',
        color: 'var(--color-text)'
      }}
    >
      <SakuraBackground />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'transparent' }}>
        <Header />
        <main style={{ flex: 1, background: 'transparent' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <AudioPlayer />
      <CartDrawer />
      <CustomCakeStudioModal />
      <AboutHoursModal />
      <ToastContainer />
    </div>
  );
}

export default RootLayout;
