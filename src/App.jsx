import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppInit } from '@/hooks/useAppInit';
import { useAuthInit } from '@/hooks/useAuthInit';
import AppLayout from '@/components/AppLayout';
import HomePage from '@/pages/HomePage';
import MenuPage from '@/pages/MenuPage';
import CartPage from '@/pages/CartPage';
import InfoPage from '@/pages/InfoPage';
import AdminLayout from '@/admin/AdminLayout';
import AdminGuard from '@/admin/AdminGuard';
import AdminLoginPage from '@/admin/AdminLoginPage';
import AdminDashboard from '@/admin/AdminDashboard';
import OrderManager from '@/admin/OrderManager';
import ProductManager from '@/admin/ProductManager';
import CategoryManager from '@/admin/CategoryManager';
import SettingsManager from '@/admin/SettingsManager';
import BannerManager from '@/admin/BannerManager';
import DeliveryZoneManager from '@/admin/DeliveryZoneManager';

export default function App() {
  useAppInit();
  useAuthInit();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/carrito" element={<CartPage />} />
      <Route path="/info" element={<InfoPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pedidos" element={<OrderManager />} />
          <Route path="productos" element={<ProductManager />} />
          <Route path="categorias" element={<CategoryManager />} />
          <Route path="banners" element={<BannerManager />} />
          <Route path="promociones" element={<DeliveryZoneManager />} />
          <Route path="delivery" element={<DeliveryZoneManager />} />
          <Route path="configuracion" element={<SettingsManager />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
