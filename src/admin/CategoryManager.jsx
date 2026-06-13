import { useEffect, useState } from 'react';
import { fetchCategories, adminSaveCategory, adminDeleteCategory } from '@/services/settings-service';

const EMPTY = { slug: '', title: '', short_title: '', icon: '', image_url: '', sort_order: 0, show_in_nav: true, active: true };

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => fetchCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  const save = async () => {
    await adminSaveCategory(form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar categoría?')) return;
    await adminDeleteCategory(id);
    load();
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-primary text-sm py-2">+ Nueva categoría</button>

      {editing && (
        <div className="card p-4 grid sm:grid-cols-2 gap-3">
          <input className="admin-input" placeholder="Slug (ej: bebidas)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className="admin-input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="admin-input" placeholder="Título corto" value={form.short_title} onChange={(e) => setForm({ ...form, short_title: e.target.value })} />
          <input className="admin-input" placeholder="Icono emoji" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <input className="admin-input sm:col-span-2" placeholder="URL imagen" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input className="admin-input" type="number" placeholder="Orden" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <div className="flex gap-4 text-sm">
            <label><input type="checkbox" checked={form.show_in_nav} onChange={(e) => setForm({ ...form, show_in_nav: e.target.checked })} /> En nav</label>
            <label><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activa</label>
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button type="button" onClick={save} className="btn-primary text-sm py-2">Guardar</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm py-2">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="font-semibold">{c.title}</p>
                <p className="text-xs text-gray-500">{c.slug} · orden {c.sort_order}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setEditing(c.id); setForm(c); }} className="text-sm text-blue-600">Editar</button>
              {!c.is_all_menu && <button type="button" onClick={() => remove(c.id)} className="text-sm text-red-600">Eliminar</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
