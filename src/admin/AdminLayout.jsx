import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { signOut, can } from '@/services/auth-service';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/format';

const NAV = [
  { to: '/admin', end: true, icon: '📊', label: 'Dashboard', perm: 'dashboard' },
  { to: '/admin/pedidos', icon: '🛒', label: 'Pedidos', perm: 'orders' },
  { to: '/admin/productos', icon: '🍗', label: 'Productos', perm: 'products' },
  { to: '/admin/categorias', icon: '📁', label: 'Categorías', perm: 'categories' },
  { to: '/admin/banners', icon: '🖼️', label: 'Banners', perm: 'banners' },
  { to: '/admin/promociones', icon: '🔥', label: 'Promos', perm: 'promotions' },
  { to: '/admin/delivery', icon: '🚚', label: 'Delivery', perm: 'delivery' },
  { to: '/admin/configuracion', icon: '⚙️', label: 'Config', perm: 'settings' },
];

export default function AdminLayout() {
  const profile = useAuthStore((s) => s.profile);
  const navigate = useNavigate();
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const visibleNav = NAV.filter((n) => can(profile, n.perm));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#111] flex">
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-pollon-red-dark text-white flex flex-col transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <img src="/img/logo pollon.png" alt="" className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="font-display text-lg">El Pollón</h1>
            <p className="text-xs text-white/60">Administración</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition',
                isActive ? 'bg-white/15 font-semibold' : 'hover:bg-white/10'
              )}
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/70 truncate">{profile?.full_name || profile?.email}</p>
          <p className="text-[10px] text-white/50 capitalize">{profile?.role_slug}</p>
          <button type="button" onClick={handleLogout} className="mt-2 w-full py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" className="lg:hidden text-xl" onClick={() => setSidebarOpen(true)}>☰</button>
            <h2 className="font-bold">Panel Admin</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={toggleDarkMode} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800">🌙</button>
            <a href="/" className="px-3 py-1.5 text-sm rounded-lg bg-pollon-red text-white">Ver App</a>
          </div>
        </header>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
