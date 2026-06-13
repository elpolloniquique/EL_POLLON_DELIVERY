/**
 * Pedidos — pedidos + detalle_pedidos (ES) o orders (legacy) + Realtime
 */
(function () {
  'use strict';

  const ORDERS_KEY = 'pollon_orders_v1';
  let orders = [];
  let channel = null;
  let backendReady = false;
  let tableMode = 'pedidos';

  function sanitize(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitize).filter(v => v !== undefined);
    const out = {};
    for (const k of Object.keys(obj)) {
      if (obj[k] === undefined) continue;
      out[k] = sanitize(obj[k]);
    }
    return out;
  }

  function rowPedidoToOrder(row) {
    const U = window.PollonUtils;
    const datos = row.datos_json || {};
    const legacyCustomer = datos.customer || {
      name: row.cliente_nombre,
      phone: row.cliente_telefono,
      address: row.cliente_direccion,
      comments: row.observaciones
    };
    const legacyItems = datos.items || [];
    return {
      id: row.id,
      createdAt: row.creado_en || row.created_at,
      ticketNumber: row.codigo_pedido || datos.ticketNumber,
      codigo_pedido: row.codigo_pedido,
      customer: legacyCustomer,
      items: legacyItems,
      total: Number(row.total) || 0,
      status: U ? U.estadoToLegacy(row.estado) : row.estado,
      estado: row.estado,
      deliveredAt: row.entregado_en || null,
      orderType: row.tipo_entrega || 'delivery',
      metodo_pago: row.metodo_pago,
      repartidor: row.repartidor || datos.repartidor || ''
    };
  }

  function orderToPedido(order) {
    const U = window.PollonUtils;
    const cust = order.customer || {};
    const codigo = order.codigo_pedido || order.ticketNumber || String(order.id).replace(/^P/, '').slice(-6);
    return sanitize({
      id: order.id,
      codigo_pedido: codigo.padStart ? codigo.toString().padStart(6, '0') : codigo,
      cliente_nombre: cust.name || '',
      cliente_telefono: cust.phone || '',
      cliente_direccion: cust.address || '',
      tipo_entrega: order.orderType || 'delivery',
      metodo_pago: order.metodo_pago || 'whatsapp',
      total: order.total || 0,
      estado: order.estado || (U ? U.estadoFromLegacy(order.status) : 'pendiente'),
      observaciones: cust.comments || order.observaciones || '',
      creado_en: order.createdAt || new Date().toISOString(),
      entregado_en: order.deliveredAt || null,
      datos_json: {
        customer: cust,
        items: order.items || [],
        ticketNumber: order.ticketNumber,
        repartidor: order.repartidor || ''
      }
    });
  }

  function rowLegacyToOrder(row) {
    return {
      id: row.id,
      createdAt: row.created_at || row.createdAt,
      ticketNumber: row.ticket_number || row.ticketNumber,
      customer: row.customer || {},
      items: row.items || [],
      total: row.total,
      status: row.status || 'Pendiente',
      deliveredAt: row.delivered_at || row.deliveredAt || null,
      orderType: row.order_type || row.orderType || 'delivery'
    };
  }

  function notifyOrdersChanged(list) {
    orders = list.slice().sort((a, b) =>
      (a.createdAt || '').localeCompare(b.createdAt || '')
    );
    if (typeof window.onPollonOrdersSync === 'function') {
      window.onPollonOrdersSync(orders);
    }
  }

  async function fetchPedidos(sb) {
    const { data, error } = await sb.from('pedidos').select('*').order('creado_en', { ascending: true });
    if (error) throw error;
    return (data || []).map(rowPedidoToOrder);
  }

  async function fetchLegacy(sb) {
    const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(rowLegacyToOrder);
  }

  async function detectMode(sb) {
    const { error } = await sb.from('pedidos').select('id').limit(1);
    if (!error) {
      tableMode = 'pedidos';
      return;
    }
    tableMode = 'orders';
  }

  async function fetchAll(sb) {
    await detectMode(sb);
    if (tableMode === 'pedidos') {
      try {
        return await fetchPedidos(sb);
      } catch (e) {
        tableMode = 'orders';
      }
    }
    return fetchLegacy(sb);
  }

  function subscribeRealtime(sb) {
    const table = tableMode === 'pedidos' ? 'pedidos' : 'orders';
    if (channel) sb.removeChannel(channel);
    channel = sb
      .channel('pollon-pedidos-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table }, async () => {
        try {
          notifyOrdersChanged(await fetchAll(sb));
        } catch (e) {
          console.warn('[Pollón] RT:', e);
        }
      })
      .subscribe();
  }

  function loadOrdersFromLocal() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      orders = raw ? JSON.parse(raw) : [];
    } catch (_) {
      orders = [];
    }
  }

  async function initOrdersBackend() {
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb) {
      loadOrdersFromLocal();
      backendReady = false;
      return;
    }
    try {
      const list = await fetchAll(sb);
      notifyOrdersChanged(list);
      subscribeRealtime(sb);
      backendReady = true;
    } catch (e) {
      console.warn('[Pollón] Pedidos:', e);
      loadOrdersFromLocal();
      backendReady = false;
    }
  }

  async function insertDetalle(sb, pedidoId, items) {
    if (tableMode !== 'pedidos' || !items?.length) return;
    const rows = items.map(it => ({
      pedido_id: pedidoId,
      producto_id: it.producto_id || null,
      nombre_producto: it.name || 'Producto',
      cantidad: it.qty || 1,
      precio_unitario: Math.round((it.total || 0) / (it.qty || 1)),
      subtotal: it.total || 0,
      extras: { drink: it.drink, bagQty: it.bagQty }
    }));
    await sb.from('detalle_pedidos').insert(rows);
  }

  async function addOrderToBackend(order) {
    if (!order?.id) return Promise.reject(new Error('Pedido inválido'));
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb || !backendReady) return Promise.reject(new Error('BD no disponible'));

    if (!order.codigo_pedido && order.ticketNumber) {
      order.codigo_pedido = String(order.ticketNumber).padStart(6, '0');
    }
    if (!order.ticketNumber && order.codigo_pedido) {
      order.ticketNumber = order.codigo_pedido;
    }

    if (tableMode === 'pedidos') {
      const row = orderToPedido(order);
      const { error } = await sb.from('pedidos').upsert(row, { onConflict: 'id' });
      if (error) return Promise.reject(error);
      try {
        await sb.from('detalle_pedidos').delete().eq('pedido_id', order.id);
        await insertDetalle(sb, order.id, order.items);
      } catch (detErr) {
        console.warn('[Pollón] detalle_pedidos:', detErr.message || detErr);
      }
      return;
    }

    const legacy = sanitize({
      id: order.id,
      created_at: order.createdAt,
      ticket_number: order.ticketNumber,
      customer: order.customer,
      items: order.items,
      total: order.total,
      status: order.status,
      delivered_at: order.deliveredAt,
      order_type: order.orderType || 'delivery'
    });
    const { error } = await sb.from('orders').upsert(legacy, { onConflict: 'id' });
    if (error) return Promise.reject(error);
  }

  async function updateOrderInBackend(order) {
    if (!order?.id) return Promise.reject(new Error('Pedido inválido'));
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb || !backendReady) {
      const idx = orders.findIndex(o => o.id === order.id);
      if (idx >= 0) orders[idx] = { ...orders[idx], ...order };
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      } catch (e) {
        console.error(e);
      }
      return Promise.resolve();
    }

    if (tableMode === 'pedidos') {
      const row = orderToPedido(order);
      const { error } = await sb.from('pedidos').upsert(row, { onConflict: 'id' });
      if (error) return Promise.reject(error);
      const idx = orders.findIndex(o => o.id === order.id);
      if (idx >= 0) orders[idx] = { ...orders[idx], ...order };
      return;
    }

    const legacy = sanitize({
      id: order.id,
      created_at: order.createdAt,
      ticket_number: order.ticketNumber,
      customer: order.customer,
      items: order.items,
      total: order.total,
      status: order.status,
      delivered_at: order.deliveredAt,
      order_type: order.orderType || 'delivery'
    });
    const { error } = await sb.from('orders').upsert(legacy, { onConflict: 'id' });
    if (error) return Promise.reject(error);
    const idx = orders.findIndex(o => o.id === order.id);
    if (idx >= 0) orders[idx] = { ...orders[idx], ...order };
  }

  function isBackendReady() {
    return backendReady && window.PollonSupabase?.isConfigured?.();
  }

  function getOrders() { return orders; }
  function setOrders(list) { orders = list; }

  function saveOrders() {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
    if (!isBackendReady()) return Promise.resolve();
    return Promise.all(orders.map(o => addOrderToBackend(o)));
  }

  function loadOrders() {
    if (isBackendReady()) return;
    loadOrdersFromLocal();
  }

  window.PollonOrders = {
    initOrdersBackend,
    isBackendReady,
    getOrders,
    setOrders,
    addOrderToBackend,
    updateOrderInBackend,
    saveOrders,
    loadOrders,
    fetchAll: async () => {
      const sb = window.PollonSupabase?.getClient?.();
      if (!sb) return getOrders();
      return fetchAll(sb);
    },
    ORDERS_KEY
  };
})();
