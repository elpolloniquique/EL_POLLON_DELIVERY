import { NavLink, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/utils/format';

const NAV_ITEMS = [
  { to: '/', icon: '🏠', label: 'Inicio' },
  { to: '/menu', icon: '🍗', label: 'Menú' },
  { to: '/carrito', icon: '🛒', label: 'Carrito', isCart: true },
  { to: '/info', icon: 'ℹ️', label: 'Info' },
  { to: '/admin', icon: '⚙️', label: 'Admin' },
];

export default function BottomNavigation() {
  const location = useLocation();
  const count = useCartStore((s) => s.getCount());
  const openCart = useCartStore((s) => s.openCart);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="max-w-lg mx-auto bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);

            if (item.isCart) {
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={openCart}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition relative',
                    isActive ? 'text-pollon-red' : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  <span className="text-xl relative">
                    {item.icon}
                    {count > 0 && (
                      <span className="absolute -top-1 -right-2 w-4 h-4 bg-pollon-red text-white text-[9px] rounded-full flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition',
                  isActive
                    ? 'text-pollon-red'
                    : 'text-gray-500 dark:text-gray-400 hover:text-pollon-red/80'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
