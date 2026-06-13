import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import BannerCarousel from '@/components/BannerCarousel';
import { useAppStore } from '@/store/appStore';
import { openWhatsapp, formatMoney } from '@/utils/format';

export default function HomePage() {
  const settings = useAppStore((s) => s.settings);
  const banners = useAppStore((s) => s.banners);
  const policies = useAppStore((s) => s.policies);
  const promotions = useAppStore((s) => s.promotions);
  const [modal, setModal] = useState(null);

  const deliveryPolicy = policies.delivery?.content || {};
  const pickupPolicy = policies.pickup?.content || {};
  const resPolicy = policies.reservations?.content || {};
  const waPolicy = policies.whatsapp?.content || {};

  return (
    <AppLayout showSearch={false}>
      <BannerCarousel banners={banners} />

      <section className="mt-6 grid grid-cols-2 gap-3">
        {[
          { id: 'delivery', icon: '🚚', label: 'Delivery', color: 'from-pollon-red to-pollon-red-dark' },
          { id: 'pickup', icon: '🛍️', label: 'Retiro', color: 'from-pollon-orange to-amber-600' },
          { id: 'reservations', icon: '📅', label: 'Reservas', color: 'from-pollon-granate to-pollon-red-dark' },
          { id: 'promos', icon: '🔥', label: 'Promos', color: 'from-pollon-gold to-orange-500' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setModal(item.id)}
            className={`card p-4 text-left bg-gradient-to-br ${item.color} text-white border-0`}
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="font-bold mt-2">{item.label}</p>
          </button>
        ))}
      </section>

      {promotions.length > 0 && (
        <section className="mt-6">
          <h3 className="font-bold text-lg mb-3">🔥 Promociones</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {promotions.map((p) => (
              <div key={p.id} className="card flex-shrink-0 w-48 p-3">
                {p.badge_text && <span className="text-xs bg-pollon-gold text-black px-2 py-0.5 rounded-full">{p.badge_text}</span>}
                <p className="font-semibold text-sm mt-1">{p.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 card p-4">
        <h3 className="font-bold mb-2">📍 {settings.short_name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{settings.address}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">🕐 {settings.schedule}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📞 {settings.phone}</p>
        <Link to="/menu" className="btn-primary w-full mt-4 block text-center">
          Ver Menú Completo
        </Link>
      </section>

      {/* Modales informativos */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1c1c1c] rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto animate-slide-up">
            {modal === 'delivery' && (
              <>
                <h2 className="text-lg font-bold mb-3">🚚 Pedido con Delivery</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{deliveryPolicy.intro}</p>
                <p className="text-xs text-gray-500">{deliveryPolicy.footnote}</p>
                <Link to="/menu" onClick={() => setModal(null)} className="btn-primary w-full mt-4 block text-center">Ir al Menú</Link>
              </>
            )}
            {modal === 'pickup' && (
              <>
                <h2 className="text-lg font-bold mb-3">🛍️ Retiro en Local</h2>
                <p className="text-sm mb-2">Monto mínimo: <strong>{formatMoney(pickupPolicy.minAmount || 100000)}</strong></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Anticipación mínima: {pickupPolicy.advanceHours || 2} horas</p>
                <button
                  type="button"
                  onClick={() => {
                    openWhatsapp(settings.whatsapp, waPolicy.pickupMessage || 'Solicito pedido con retiro');
                    setModal(null);
                  }}
                  className="btn-primary w-full"
                >
                  Solicitar con retiro
                </button>
              </>
            )}
            {modal === 'reservations' && (
              <>
                <h2 className="text-lg font-bold mb-3">📅 Reservas</h2>
                <p className="text-sm mb-2">Monto mínimo: <strong>{formatMoney(resPolicy.minAmount || 200000)}</strong></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{resPolicy.note}</p>
                {settings.reservas_url ? (
                  <a href={settings.reservas_url} target="_blank" rel="noreferrer" className="btn-primary w-full block text-center">
                    Realizar mi reserva
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => { openWhatsapp(settings.whatsapp, 'Hola, quiero hacer una reserva'); setModal(null); }}
                    className="btn-primary w-full"
                  >
                    Contactar por WhatsApp
                  </button>
                )}
              </>
            )}
            {modal === 'promos' && (
              <>
                <h2 className="text-lg font-bold mb-3">🔥 Promociones</h2>
                {promotions.length ? promotions.map((p) => (
                  <div key={p.id} className="mb-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-gray-500">{p.description}</p>
                  </div>
                )) : <p className="text-gray-500">No hay promociones activas.</p>}
                <Link to="/menu" onClick={() => setModal(null)} className="btn-primary w-full mt-2 block text-center">Ver Menú</Link>
              </>
            )}
            <button type="button" onClick={() => setModal(null)} className="btn-secondary w-full mt-3">Cerrar</button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
