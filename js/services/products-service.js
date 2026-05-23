/**
 * Productos — tablas productos + categorias (español) con fallback local
 */
(function () {
  'use strict';

  let catalog = null;
  let loadedFrom = 'fallback';
  let useSpanish = true;

  function mapProducto(row, slug) {
    return {
      id: row.id,
      name: row.nombre,
      description: row.descripcion || '',
      price: Number(row.precio) || 0,
      image: row.imagen_url || '',
      stock: row.stock != null ? row.stock : 99,
      available: row.disponible !== false,
      tags: [],
      popularity: row.destacado ? 10 : 0,
      promotion: row.promocion || null,
      __category: slug || row.categoria_slug || ''
    };
  }

  async function loadFromSpanish(sb) {
    const { data: cats, error: catErr } = await sb
      .from('categorias')
      .select('id, slug, nombre, orden')
      .eq('activo', true)
      .order('orden', { ascending: true });
    if (catErr) throw catErr;

    const { data: prods, error: prodErr } = await sb
      .from('productos')
      .select('*, categorias(slug)')
      .eq('disponible', true)
      .order('nombre', { ascending: true });
    if (prodErr) throw prodErr;

    const slugById = {};
    (cats || []).forEach(c => { slugById[c.id] = c.slug; });

    const grouped = {};
    (prods || []).forEach(row => {
      const slug = row.categorias?.slug || slugById[row.categoria_id] || 'otros';
      if (!grouped[slug]) grouped[slug] = [];
      grouped[slug].push(mapProducto(row, slug));
    });
    return grouped;
  }

  async function loadFromLegacy(sb) {
    const { data, error } = await sb.from('products').select('*').eq('available', true);
    if (error) throw error;
    const grouped = {};
    (data || []).forEach(row => {
      const slug = row.category_slug || row.category;
      if (!slug) return;
      if (!grouped[slug]) grouped[slug] = [];
      grouped[slug].push({
        id: row.id,
        name: row.name,
        description: row.description || '',
        price: Number(row.price) || 0,
        image: row.image_url || row.image || '',
        stock: row.stock ?? 99,
        available: row.available !== false,
        tags: row.tags || [],
        popularity: row.popularity || 0,
        promotion: row.promotion || null
      });
    });
    return grouped;
  }

  async function loadProducts() {
    const fallback = window.POLLON_FALLBACK_PRODUCTS || {};
    catalog = JSON.parse(JSON.stringify(fallback));
    loadedFrom = 'fallback';

    const sb = window.PollonSupabase?.getClient?.();
    if (!sb || !window.PollonSupabase?.isConfigured?.()) {
      return { products: catalog, source: loadedFrom };
    }

    try {
      const grouped = await loadFromSpanish(sb);
      if (Object.keys(grouped).length) {
        catalog = grouped;
        loadedFrom = 'supabase';
        useSpanish = true;
        return { products: catalog, source: loadedFrom };
      }
    } catch (e) {
      console.warn('[Pollón] productos ES:', e.message);
    }

    try {
      const grouped = await loadFromLegacy(sb);
      if (Object.keys(grouped).length) {
        catalog = grouped;
        loadedFrom = 'supabase-legacy';
        useSpanish = false;
        return { products: catalog, source: loadedFrom };
      }
    } catch (e2) {
      console.warn('[Pollón] products legacy:', e2.message);
    }

    return { products: catalog, source: loadedFrom };
  }

  function getCatalog() {
    return catalog || window.POLLON_FALLBACK_PRODUCTS || {};
  }

  async function adminListAll() {
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb) return [];
    const { data, error } = await sb
      .from('productos')
      .select('*, categorias(id, nombre, slug)')
      .order('nombre');
    if (error) throw error;
    return data || [];
  }

  async function adminUpsert(producto) {
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb) throw new Error('Sin conexión');
    const row = {
      id: producto.id || undefined,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      categoria_id: producto.categoria_id,
      imagen_url: producto.imagen_url || '',
      stock: producto.stock ?? 99,
      disponible: producto.disponible !== false,
      destacado: !!producto.destacado,
      promocion: producto.promocion || null
    };
    const { data, error } = await sb.from('productos').upsert(row).select().single();
    if (error) throw error;
    return data;
  }

  async function adminDelete(id) {
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb) throw new Error('Sin conexión');
    const { error } = await sb.from('productos').delete().eq('id', id);
    if (error) throw error;
  }

  async function uploadImage(file, pathPrefix) {
    const sb = window.PollonSupabase?.getClient?.();
    const bucket = window.SUPABASE_CONFIG?.storageBucket || 'product-images';
    if (!sb) throw new Error('Sin conexión');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${pathPrefix || 'productos'}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });
    if (error) throw error;
    const { data } = sb.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  window.PollonProducts = {
    loadProducts,
    getCatalog,
    getSource: () => loadedFrom,
    adminListAll,
    adminUpsert,
    adminDelete,
    uploadImage
  };
})();
