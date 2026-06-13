import { useEffect, useState } from 'react';
import { fetchDeliveryZones, adminSaveZone, adminDeleteZone, fetchPromotions, adminSavePromotion, adminDeletePromotion } from '@/services/settings-service';
import { formatMoney } from '@/utils/format';

export default function DeliveryZoneManager() {
  const [zones, setZones] = useState([]);
  const [promos, setPromos] = useState([]);
  const [zoneForm, setZoneForm] = useState(null);
  const [promoForm, setPromoForm] = useState(null);

  const load = async () => {
    setZones(await fetchDeliveryZones());
    setPromos(await fetchPromotions());
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">🚚 Zonas de Delivery</h3>
          <button type="button" onClick={() => setZoneForm({ name: '', cost: 2500, sort_order: 0, active: true })} className="btn-primary text-sm py-2">+ Zona</button>
        </div>
        {zoneForm && (
          <div className="card p-4 grid sm:grid-cols-3 gap-3 mb-3">
            <input className="admin-input" placeholder="Nombre zona" value={zoneForm.name} onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })} />
            <input className="admin-input" type="number" placeholder="Costo" value={zoneForm.cost} onChange={(e) => setZoneForm({ ...zoneForm, cost: Number(e.target.value) })} />
            <div className="flex gap-2">
              <button type="button" onClick={async () => { await adminSaveZone(zoneForm); setZoneForm(null); load(); }} className="btn-primary text-sm py-2">Guardar</button>
              <button type="button" onClick={() => setZoneForm(null)} className="btn-secondary text-sm py-2">Cancelar</button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {zones.map((z) => (
            <div key={z.id} className="card p-3 flex justify-between items-center">
              <span>{z.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-pollon-red">{formatMoney(z.cost)}</span>
                <button type="button" onClick={() => setZoneForm(z)} className="text-xs text-blue-600">Editar</button>
                <button type="button" onClick={() => adminDeleteZone(z.id).then(load)} className="text-xs text-red-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">🔥 Promociones</h3>
          <button type="button" onClick={() => setPromoForm({ title: '', description: '', badge_text: '', active: true })} className="btn-primary text-sm py-2">+ Promo</button>
        </div>
        {promoForm && (
          <div className="card p-4 grid gap-3 mb-3 max-w-lg">
            <input className="admin-input" placeholder="Título" value={promoForm.title} onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })} />
            <textarea className="admin-input" placeholder="Descripción" value={promoForm.description || ''} onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })} />
            <input className="admin-input" placeholder="Badge" value={promoForm.badge_text || ''} onChange={(e) => setPromoForm({ ...promoForm, badge_text: e.target.value })} />
            <div className="flex gap-2">
              <button type="button" onClick={async () => { await adminSavePromotion(promoForm); setPromoForm(null); load(); }} className="btn-primary text-sm py-2">Guardar</button>
              <button type="button" onClick={() => setPromoForm(null)} className="btn-secondary text-sm py-2">Cancelar</button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {promos.map((p) => (
            <div key={p.id} className="card p-3 flex justify-between">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-gray-500">{p.description}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPromoForm(p)} className="text-xs text-blue-600">Editar</button>
                <button type="button" onClick={() => adminDeletePromotion(p.id).then(load)} className="text-xs text-red-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
