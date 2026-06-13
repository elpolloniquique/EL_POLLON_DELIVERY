import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories, adminSaveProduct, adminDeleteProduct } from '@/services/settings-service';
import { formatMoney } from '@/utils/format';

const EMPTY = { name: '', description: '', price: 0, category_slug: 'ofertas-familiares', image_url: '', available: true };

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');

  const load = async () => {
    const [p, c] = await Promise.all([fetchProducts(), fetchCategories()]);
    setProducts(p);
    setCategories(c.filter((cat) => !cat.is_all_menu));
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) =>
    !search || (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing('new'); setForm(EMPTY); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...p }); };

  const save = async () => {
    const cat = categories.find((c) => c.slug === form.category_slug);
    await adminSaveProduct({
      ...form,
      price: Number(form.price),
      category_id: cat?.id,
    });
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    await adminDeleteProduct(id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between">
        <input type="search" className="admin-input max-w-xs" placeholder="Buscar producto…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="button" onClick={openNew} className="btn-primary text-sm py-2">+ Nuevo producto</button>
      </div>

      {editing && (
        <div className="card p-4 space-y-3">
          <h3 className="font-bold">{editing === 'new' ? 'Nuevo producto' : 'Editar producto'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="admin-input" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="admin-input" type="number" placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <select className="admin-input" value={form.category_slug} onChange={(e) => setForm({ ...form, category_slug: e.target.value })}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
            </select>
            <input className="admin-input" placeholder="URL imagen" value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <textarea className="admin-input sm:col-span-2" placeholder="Descripción" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.available !== false} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
              Disponible
            </label>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save} className="btn-primary text-sm py-2">Guardar</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm py-2">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="card p-3 flex gap-3">
            <img src={p.image_url || '/img/todo el menu.png'} alt="" className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{p.name}</p>
              <p className="text-pollon-red font-bold text-sm">{formatMoney(p.price)}</p>
              <p className="text-xs text-gray-500">{p.category_slug}</p>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => openEdit(p)} className="text-xs text-blue-600">Editar</button>
                <button type="button" onClick={() => remove(p.id)} className="text-xs text-red-600">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
