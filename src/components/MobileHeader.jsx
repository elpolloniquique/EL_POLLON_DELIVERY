import { useAppStore } from '@/store/appStore';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/utils/format';

export default function MobileHeader({ onSearch }) {
  const settings = useAppStore((s) => s.settings);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const darkMode = useAppStore((s) => s.darkMode);
  const searchTerm = useAppStore((s) => s.searchTerm);
  const setSearchTerm = useAppStore((s) => s.setSearchTerm);
  const count = useCartStore((s) => s.getCount());
  const openCart = useCartStore((s) => s.openCart);

  return (
    <header className="sticky top-0 z-40 safe-top bg-pollon-red-dark/95 backdrop-blur-md border-b border-white/10 shadow-header">
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={settings.logo_url || '/img/logo pollon.png'}
          alt={settings.short_name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-pollon-gold/60"
        />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl text-white tracking-wide leading-none truncate">
            {settings.business_name || 'EL POLLÓN'}
          </h1>
          <p className="text-xs text-white/70 truncate">{settings.tagline || 'Sabor Peruano'}</p>
        </div>
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full bg-white/10 text-white text-sm flex items-center justify-center"
          aria-label="Cambiar tema"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button
          type="button"
          onClick={openCart}
          className="relative w-9 h-9 rounded-full bg-pollon-gold text-pollon-black font-bold text-sm flex items-center justify-center"
          aria-label="Ver carrito"
        >
          🛒
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-pollon-red text-white text-[10px] rounded-full flex items-center justify-center animate-pulse-soft">
              {count}
            </span>
          )}
        </button>
      </div>
      {onSearch !== false && (
        <div className="px-4 pb-3">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en el menú…"
            className="w-full px-4 py-2.5 rounded-2xl bg-white/95 text-pollon-black text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pollon-gold"
          />
        </div>
      )}
    </header>
  );
}
