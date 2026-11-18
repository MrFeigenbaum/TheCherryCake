import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { hideToast } from './store';
import type { RootState } from './store';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Toast from './components/ui/Toast';
import { FreyjaEasterEgg } from './components/common/FreyjaEasterEgg';
import SakuraBackground from './components/common/SakuraBackground';
import AudioPlayer from './components/common/AudioPlayer';
import UIKit from './pages/UIKit';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Reports from './pages/Reports';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

import './App.css';

export default function App() {
  const toast = useSelector((state: RootState) => state.ui.toast);
  const theme = useSelector((state: RootState) => state.ui.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <div className="cc-app">
      <SakuraBackground />
      <Header />

      <main className="cc-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/ui-kit" element={<UIKit />} />
        </Routes>
      </main>

      <Footer />

      <Toast
        message={toast}
        type="error"
        onClose={() => dispatch(hideToast())}
      />

      <AudioPlayer />
      <FreyjaEasterEgg />
    </div>
  );
}
