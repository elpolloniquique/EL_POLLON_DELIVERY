import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/store/appStore';
import { formatMoney } from '@/utils/format';

export default function InfoPage() {
  const settings = useAppStore((s) => s.settings);
  const zones = useAppStore((s) => s.zones);
  const social = settings.social || {};

  return (
    <AppLayout showSearch={false}>
      <h2 className="text-xl font-bold mt-2 mb-4">ℹ️ Información</h2>

      <section className="card p-4 mb-4">
        <h3 className="font-bold mb-2">📍 Ubicación</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{settings.address}</p>
        <p className="text-sm mt-1">{settings.city}, Chile</p>
        {settings.map_embed && (
          <iframe
            title="Mapa"
            src={settings.map_embed}
            className="w-full h-48 rounded-xl mt-3 border-0"
            loading="lazy"
          />
        )}
      </section>

      <section className="card p-4 mb-4">
        <h3 className="font-bold mb-2">🕐 Horarios</h3>
        <p className="text-sm">{settings.schedule_long || settings.schedule}</p>
      </section>

      <section className="card p-4 mb-4">
        <h3 className="font-bold mb-2">🚚 Zonas de Delivery</h3>
        <ul className="space-y-2">
          {zones.map((z) => (
            <li key={z.id} className="flex justify-between text-sm">
              <span>{z.name}</span>
              <span className="font-semibold text-pollon-red">{formatMoney(z.cost)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-4 mb-4">
        <h3 className="font-bold mb-2">📞 Contacto</h3>
        <a href={`tel:${settings.phone_raw || settings.phone}`} className="text-pollon-red font-medium block">{settings.phone}</a>
        <div className="flex gap-3 mt-3">
          {Object.values(social).map((s) => s?.url && (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-pollon-red">
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-gray-500 py-6">
        <p>{settings.footer?.copyright || `© ${new Date().getFullYear()} Pollería El Pollón`}</p>
        <p className="mt-1">📍 Iquique, Chile · Pollo a la brasa</p>
      </footer>
    </AppLayout>
  );
}
