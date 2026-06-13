import { useEffect, useState } from 'react';
import { fetchBanners, adminSaveBanner, adminDeleteBanner } from '@/services/settings-service';

const EMPTY = { title: '', subtitle: '', image_url: '', link_url: '', sort_order: 0, active: true };

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => fetchBanners().then(setBanners);
  useEffect(() => { load(); }, []);

  const save = async () => {
    await adminSaveBanner(form);
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-primary text-sm py-2">+ Nuevo banner</button>

      {editing && (
        <div className="card p-4 grid gap-3 max-w-lg">
          <input className="admin-input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="admin-input" placeholder="Subtítulo" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <input className="admin-input" placeholder="URL imagen" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input className="admin-input" placeholder="Link (opcional)" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
          <div className="flex gap-2">
            <button type="button" onClick={save} className="btn-primary text-sm py-2">Guardar</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm py-2">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="card overflow-hidden">
            <img src={b.image_url} alt={b.title} className="w-full h-32 object-cover" />
            <div className="p-3 flex justify-between">
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="text-xs text-gray-500">{b.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setEditing(b.id); setForm(b); }} className="text-xs text-blue-600">Editar</button>
                <button type="button" onClick={() => adminDeleteBanner(b.id).then(load)} className="text-xs text-red-600">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
