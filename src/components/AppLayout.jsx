import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';
import CartDrawer from './CartDrawer';
import Toast from './Toast';
import AppLoader from './AppLoader';

export default function AppLayout({ children, showSearch = true }) {
  return (
    <div className="app-container dark:bg-pollon-black">
      <AppLoader />
      <MobileHeader onSearch={showSearch} />
      <main className="px-4 pb-4">{children}</main>
      <BottomNavigation />
      <CartDrawer />
      <Toast />
    </div>
  );
}
