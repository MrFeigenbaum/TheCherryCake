import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchRegions } from './store/regionSlice';

import RootLayout from './components/layout/RootLayout';
import AdminLayout from './components/layout/AdminLayout';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Reports from './pages/Reports';
import UiKit from './pages/UiKit';

import AdminCatalog from './pages/Admin/Catalog';
import AdminPrices from './pages/Admin/Prices';
import AdminRegions from './pages/Admin/Regions';
import AdminDiscounts from './pages/Admin/Discounts';
import AdminPromoCodes from './pages/Admin/PromoCodes';
import AdminOrders from './pages/Admin/Orders';

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="booking" element={<Booking />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="account" element={<Account />} />
          <Route path="reports" element={<Reports />} />
          <Route path="ui-kit" element={<UiKit />} />

          {/* Admin Nested Routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="catalog" replace />} />
            <Route path="catalog" element={<AdminCatalog />} />
            <Route path="prices" element={<AdminPrices />} />
            <Route path="regions" element={<AdminRegions />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="promo-codes" element={<AdminPromoCodes />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
