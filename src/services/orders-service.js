import { getSupabase } from '@/lib/supabase';
import { generateOrderId, generateTicketNumber } from '@/utils/format';

export async function fetchOrders() {
  const sb = getSupabase();
  if (!sb) {
    try {
      const raw = localStorage.getItem('pollon_orders_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createOrder(order, existingCount = 0) {
  const sb = getSupabase();
  const payload = {
    id: order.id || generateOrderId(),
    ticket_number: order.ticket_number || generateTicketNumber(existingCount),
    customer: order.customer || {},
    items: order.items || [],
    total: order.total || 0,
    status: 'pendiente',
    order_type: order.order_type || 'delivery',
    delivery_zone: order.delivery_zone || '',
    delivery_cost: order.delivery_cost || 0,
    payment_method: 'whatsapp',
    notes: order.notes || '',
    created_at: new Date().toISOString(),
  };

  if (!sb) {
    const orders = await fetchOrders();
    orders.push(payload);
    localStorage.setItem('pollon_orders_v1', JSON.stringify(orders));
    return payload;
  }

  const { data, error } = await sb.from('orders').insert(payload).select().single();
  if (error) throw error;

  if (order.items?.length) {
    const items = order.items.map((it) => ({
      order_id: data.id,
      product_id: it.productId || null,
      product_name: it.name,
      quantity: it.qty || 1,
      unit_price: it.price || 0,
      subtotal: it.total || 0,
      options: { drink: it.drink, bagQty: it.bagQty },
    }));
    await sb.from('order_items').insert(items);
  }

  return data;
}

export async function updateOrderStatus(id, status, extra = {}) {
  const sb = getSupabase();
  const payload = { ...extra };
  if (status) {
    payload.status = status;
    if (status === 'entregado') payload.delivered_at = new Date().toISOString();
  }

  if (!sb) {
    const orders = await fetchOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], ...payload };
      localStorage.setItem('pollon_orders_v1', JSON.stringify(orders));
    }
    return orders[idx];
  }

  const { data, error } = await sb.from('orders').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export function subscribeOrders(callback) {
  const sb = getSupabase();
  if (!sb) return () => {};

  const channel = sb
    .channel('orders-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
      const orders = await fetchOrders();
      callback(orders);
    })
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}

export function filterOrders(orders, filters) {
  const { from, to, status, search, driver, hourFrom, hourTo } = filters;
  return orders.filter((o) => {
    const d = (o.created_at || '').substring(0, 10);
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (status && o.status !== status) return false;
    if (driver && (o.driver || '') !== driver) return false;
    if (search) {
      const q = search.toLowerCase();
      const c = o.customer || {};
      const hay = `${c.name || ''} ${c.phone || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (hourFrom || hourTo) {
      const date = new Date(o.created_at);
      const mins = date.getHours() * 60 + date.getMinutes();
      const parse = (t) => {
        if (!t) return null;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + (m || 0);
      };
      const fromM = parse(hourFrom) ?? 0;
      const toM = parse(hourTo) ?? 24 * 60 - 1;
      if (fromM <= toM ? mins < fromM || mins > toM : mins < fromM && mins > toM) return false;
    }
    return true;
  });
}

export function computeSalesStats(orders) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now - 7 * 86400000).toISOString().slice(0, 10);
  const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  const delivered = orders.filter((o) => o.status === 'entregado');
  const todayOrders = orders.filter((o) => (o.created_at || '').slice(0, 10) === today);
  const weekOrders = orders.filter((o) => (o.created_at || '').slice(0, 10) >= weekAgo);
  const monthOrders = orders.filter((o) => (o.created_at || '').slice(0, 10) >= monthAgo);

  const sum = (list) => list.reduce((a, o) => a + (Number(o.total) || 0), 0);

  return {
    totalOrders: orders.length,
    todayCount: todayOrders.length,
    todaySales: sum(todayOrders),
    weekSales: sum(weekOrders),
    monthSales: sum(monthOrders),
    pending: orders.filter((o) => o.status === 'pendiente').length,
    deliveredPct: orders.length ? Math.round((delivered.length / orders.length) * 100) : 0,
    avgTicket: delivered.length ? Math.round(sum(delivered) / delivered.length) : 0,
  };
}
