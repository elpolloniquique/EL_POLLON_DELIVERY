import { getSupabase } from '@/lib/supabase';
import { FALLBACK_SETTINGS } from '@/lib/constants';
import { fallbackCategories, fallbackProducts, fallbackBanners, fallbackZones, fallbackOptions } from '@/data/fallback';

export async function fetchSettings() {
  const sb = getSupabase();
  if (!sb) return { settings: FALLBACK_SETTINGS, policies: {}, branch: null };

  const { data: settings } = await sb.from('settings').select('*').limit(1).maybeSingle();
  const { data: policies } = await sb.from('business_policies').select('*').eq('active', true);
  const { data: branch } = await sb.from('branches').select('*').eq('is_main', true).maybeSingle();

  const policiesMap = {};
  (policies || []).forEach((p) => {
    policiesMap[p.policy_type] = p;
  });

  return {
    settings: settings || FALLBACK_SETTINGS,
    policies: policiesMap,
    branch,
  };
}

export async function updateSettings(id, payload) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase no configurado');
  const { data, error } = await sb.from('settings').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function fetchCategories() {
  const sb = getSupabase();
  if (!sb) return fallbackCategories;
  const { data, error } = await sb.from('categories').select('*').order('sort_order');
  if (error || !data?.length) return fallbackCategories;
  return data;
}

export async function fetchProducts() {
  const sb = getSupabase();
  if (!sb) return fallbackProducts;
  const { data, error } = await sb.from('products').select('*').order('sort_order');
  if (error || !data?.length) return fallbackProducts;
  return data;
}

export async function fetchBanners() {
  const sb = getSupabase();
  if (!sb) return fallbackBanners;
  const { data } = await sb.from('banners').select('*').eq('active', true).order('sort_order');
  return data?.length ? data : fallbackBanners;
}

export async function fetchDeliveryZones() {
  const sb = getSupabase();
  if (!sb) return fallbackZones;
  const { data } = await sb.from('delivery_zones').select('*').eq('active', true).order('sort_order');
  return data?.length ? data : fallbackZones;
}

export async function fetchProductOptions() {
  const sb = getSupabase();
  if (!sb) return fallbackOptions;
  const { data } = await sb.from('product_options').select('*').eq('active', true).order('sort_order');
  return data?.length ? data : fallbackOptions;
}

export async function fetchPromotions() {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from('promotions').select('*').eq('active', true).order('created_at', { ascending: false });
  return data || [];
}

// Admin CRUD
export async function adminSaveCategory(category) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase no configurado');
  if (category.id) {
    const { data, error } = await sb.from('categories').update(category).eq('id', category.id).select().single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await sb.from('categories').insert(category).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteCategory(id) {
  const sb = getSupabase();
  const { error } = await sb.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function adminSaveProduct(product) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase no configurado');
  if (product.id) {
    const { data, error } = await sb.from('products').update(product).eq('id', product.id).select().single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await sb.from('products').insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteProduct(id) {
  const sb = getSupabase();
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function adminSaveBanner(banner) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase no configurado');
  if (banner.id) {
    const { data, error } = await sb.from('banners').update(banner).eq('id', banner.id).select().single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await sb.from('banners').insert(banner).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteBanner(id) {
  const sb = getSupabase();
  const { error } = await sb.from('banners').delete().eq('id', id);
  if (error) throw error;
}

export async function adminSaveZone(zone) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase no configurado');
  if (zone.id) {
    const { data, error } = await sb.from('delivery_zones').update(zone).eq('id', zone.id).select().single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await sb.from('delivery_zones').insert(zone).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteZone(id) {
  const sb = getSupabase();
  const { error } = await sb.from('delivery_zones').delete().eq('id', id);
  if (error) throw error;
}

export async function adminSavePromotion(promo) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase no configurado');
  if (promo.id) {
    const { data, error } = await sb.from('promotions').update(promo).eq('id', promo.id).select().single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await sb.from('promotions').insert(promo).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeletePromotion(id) {
  const sb = getSupabase();
  const { error } = await sb.from('promotions').delete().eq('id', id);
  if (error) throw error;
}

export async function adminUpdatePolicy(id, content) {
  const sb = getSupabase();
  const { data, error } = await sb.from('business_policies').update({ content }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
