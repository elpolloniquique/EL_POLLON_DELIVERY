/**
 * Panel Admin — El Pollón
 */
(function () {
  'use strict';

  const U = window.PollonUtils;
  const Auth = window.PollonAuth;
  let orders = [];
  let categorias = [];
  let productos = [];

  const NAV = [
    { id: 'dashboard', label: '📊 Dashboard', perm: 'dashboard', title: 'Dashboard' },
    { id: 'pedidos', label: '🛒 Pedidos', perm: 'orders', title: 'Pedidos' },
    { id: 'productos', label: '🍗 Productos', perm: 'products', title: 'Productos' },
    { id: 'categorias', label: '📁 Categorías', perm: 'categories', title: 'Categorías' },
    { id: 'config', label: '⚙️ Configuración', perm: 'settings', title: 'Configuración' }
  ];

  function sb() {
    return window.PollonSupabase?.getClient?.();
  }

  function toast(msg) {
    U.toast(msg);
  }

  function badgeEstado(estado) {
    const e = (estado || 'pendiente').toLowerCase();
    const cls = ['entregado', 'cancelado', 'preparando', 'pendiente'].includes(e)
      ? `admin-badge-${e === 'en_delivery' ? 'preparando' : e}` : 'admin-badge-pendiente';
    return `<span class="admin-badge ${cls}">${e}</span>`;
  }

  async function loadOrders() {
    await window.PollonOrders.initOrdersBackend();
    if (window.PollonOrders.fetchAll) {
      orders = await window.PollonOrders.fetchAll();
    } else {
      orders = window.PollonOrders.getOrders();
    }
  }

  async function loadCategorias() {
    const client = sb();
    if (!client) return;
    const { data } = await client.from('categorias').select('*').order('orden');
    categorias = data || [];
  }

  async function loadProductos() {
    try {
      productos = await window.PollonProducts.adminListAll();
    } catch (e) {
      productos = [];
      console.warn(e);
    }
  }

  function filterPedidos() {
    const desde = document.getElementById('filtro-desde')?.value;
    const hasta = document.getElementById('filtro-hasta')?.value;
    const estado = document.getElementById('filtro-estado')?.value;
    const q = (document.getElementById('filtro-buscar')?.value || '').toLowerCase();
    return orders.filter(o => {
      const d = (o.createdAt || '').substring(0, 10);
      if (desde && d < desde) return false;
      if (hasta && d > hasta) return false;
      const est = o.estado || U.estadoFromLegacy(o.status);
      if (estado && est !== estado) return false;
      if (q) {
        const n = (o.customer?.name || '').toLowerCase();
        const t = (o.customer?.phone || '').toLowerCase();
        if (!n.includes(q) && !t.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  function renderPedidos() {
    const tbody = document.getElementById('pedidos-tbody');
    if (!tbody) return;
    const list = filterPedidos();
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="7">Sin pedidos</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(o => {
      const c = o.customer || {};
      const est = o.estado || U.estadoFromLegacy(o.status);
      return `<tr>
        <td>${o.codigo_pedido || o.ticketNumber || o.id}</td>
        <td>${c.name || '-'}</td>
        <td>${c.phone || '-'}</td>
        <td>${U.money(o.total)}</td>
        <td>${badgeEstado(est)}</td>
        <td>${U.formatDateTime(o.createdAt)}</td>
        <td>
          <button class="admin-btn admin-btn-sm admin-btn-ghost" data-action="estado" data-id="${o.id}">Estado</button>
          <button class="admin-btn admin-btn-sm admin-btn-ghost" data-action="print" data-id="${o.id}">🖨️</button>
        </td>
      </tr>`;
    }).join('');
  }

  function renderProductos() {
    const tbody = document.getElementById('productos-tbody');
    if (!tbody) return;
    tbody.innerHTML = productos.map(p => `
      <tr>
        <td>${p.imagen_url ? `<img src="${p.imagen_url}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:6px">` : '—'}</td>
        <td>${p.nombre}</td>
        <td>${p.categorias?.nombre || '-'}</td>
        <td>${U.money(p.precio)}</td>
        <td>${p.stock ?? 0}</td>
        <td>${p.disponible ? '✅' : '❌'}</td>
        <td>
          <button class="admin-btn admin-btn-sm admin-btn-ghost" data-edit-prod="${p.id}">Editar</button>
          <button class="admin-btn admin-btn-sm admin-btn-ghost" data-del-prod="${p.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  function renderCategorias() {
    const tbody = document.getElementById('categorias-tbody');
    if (!tbody) return;
    tbody.innerHTML = categorias.map(c => `
      <tr><td>${c.orden}</td><td>${c.nombre}</td><td><code>${c.slug}</code></td><td>${c.activo ? 'Sí' : 'No'}</td></tr>
    `).join('');
  }

  function computeStats() {
    const today = U.todayISO();
    const pedidosHoy = orders.filter(o => (o.createdAt || '').startsWith(today));
    const ventasHoy = pedidosHoy.reduce((s, o) => s + (o.total || 0), 0);
    const pendientes = orders.filter(o => {
      const e = o.estado || U.estadoFromLegacy(o.status);
      return e === 'pendiente' || e === 'confirmado' || e === 'preparando';
    }).length;
    const entregados = orders.filter(o => (o.estado || U.estadoFromLegacy(o.status)) === 'entregado').length;
    const ticket = orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0;
    return {
      total: orders.length,
      hoy: pedidosHoy.length,
      ventasHoy,
      pendientes,
      entregados,
      ticket
    };
  }

  function renderDashboard() {
    const s = computeStats();
    document.getElementById('dash-stats').innerHTML = `
      <div class="admin-stat"><div class="admin-stat-label">Pedidos hoy</div><div class="admin-stat-value">${s.hoy}</div></div>
      <div class="admin-stat"><div class="admin-stat-label">Ventas hoy</div><div class="admin-stat-value">${U.money(s.ventasHoy)}</div></div>
      <div class="admin-stat"><div class="admin-stat-label">Pendientes</div><div class="admin-stat-value">${s.pendientes}</div></div>
      <div class="admin-stat"><div class="admin-stat-label">Total pedidos</div><div class="admin-stat-value">${s.total}</div></div>
      <div class="admin-stat"><div class="admin-stat-label">Entregados</div><div class="admin-stat-value">${s.entregados}</div></div>
      <div class="admin-stat"><div class="admin-stat-label">Ticket promedio</div><div class="admin-stat-value">${U.money(s.ticket)}</div></div>
    `;

    const days = [];
    const sales = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(d.toLocaleDateString('es-CL', { weekday: 'short' }));
      sales.push(orders.filter(o => (o.createdAt || '').startsWith(key)).reduce((sum, o) => sum + o.total, 0));
    }
    window.PollonCharts.createLine('chart-ventas-dia', days, sales);

    const estados = {};
    orders.forEach(o => {
      const e = o.estado || U.estadoFromLegacy(o.status) || 'pendiente';
      estados[e] = (estados[e] || 0) + 1;
    });
    window.PollonCharts.createDoughnut('chart-estados', Object.keys(estados), Object.values(estados));

    const prodCount = {};
    orders.forEach(o => {
      (o.items || []).forEach(it => {
        const n = it.name || '?';
        prodCount[n] = (prodCount[n] || 0) + (it.qty || 1);
      });
    });
    const top = Object.entries(prodCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
    window.PollonCharts.createBar('chart-top-productos', top.map(t => t[0].slice(0, 18)), top.map(t => t[1]), 'Unidades');
  }

  async function changeEstado(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    const cur = o.estado || U.estadoFromLegacy(o.status);
    const next = U.nextEstado(cur);
    o.estado = next;
    o.status = U.estadoToLegacy(next);
    if (next === 'entregado') o.deliveredAt = new Date().toISOString();
    try {
      await window.PollonOrders.updateOrderInBackend(o);
      toast('Estado: ' + next);
      await refresh();
    } catch (e) {
      toast('Error al actualizar');
    }
  }

  function exportCsv() {
    const list = filterPedidos();
    const rows = [['Codigo', 'Cliente', 'Telefono', 'Total', 'Estado', 'Fecha']];
    list.forEach(o => {
      rows.push([
        o.codigo_pedido || o.id,
        o.customer?.name,
        o.customer?.phone,
        o.total,
        o.estado || o.status,
        o.createdAt
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `pedidos-pollon-${U.todayISO()}.csv`;
    a.click();
  }

  function openProductModal(prod) {
    document.getElementById('modal-producto').classList.add('open');
    document.getElementById('modal-producto-title').textContent = prod ? 'Editar producto' : 'Nuevo producto';
    document.getElementById('prod-id').value = prod?.id || '';
    document.getElementById('prod-nombre').value = prod?.nombre || '';
    document.getElementById('prod-precio').value = prod?.precio || '';
    document.getElementById('prod-descripcion').value = prod?.descripcion || '';
    document.getElementById('prod-stock').value = prod?.stock ?? 99;
    document.getElementById('prod-imagen').value = prod?.imagen_url || '';
    document.getElementById('prod-disponible').checked = prod?.disponible !== false;
    document.getElementById('prod-destacado').checked = !!prod?.destacado;
    const sel = document.getElementById('prod-categoria');
    sel.innerHTML = categorias.map(c => `<option value="${c.id}" ${prod?.categoria_id === c.id ? 'selected' : ''}>${c.nombre}</option>`).join('');
  }

  async function saveProducto() {
    const file = document.getElementById('prod-file').files[0];
    let imagen = document.getElementById('prod-imagen').value.trim();
    if (file) {
      imagen = await window.PollonProducts.uploadImage(file, 'productos');
    }
    const payload = {
      id: document.getElementById('prod-id').value || undefined,
      nombre: document.getElementById('prod-nombre').value.trim(),
      precio: Number(document.getElementById('prod-precio').value),
      descripcion: document.getElementById('prod-descripcion').value,
      categoria_id: document.getElementById('prod-categoria').value,
      stock: Number(document.getElementById('prod-stock').value),
      imagen_url: imagen,
      disponible: document.getElementById('prod-disponible').checked,
      destacado: document.getElementById('prod-destacado').checked
    };
    await window.PollonProducts.adminUpsert(payload);
    document.getElementById('modal-producto').classList.remove('open');
    toast('Producto guardado');
    await loadProductos();
    renderProductos();
  }

  async function loadConfig() {
    const client = sb();
    if (!client) return;
    const { data } = await client.from('configuracion_tienda').select('*').eq('id', 1).maybeSingle();
    if (!data) return;
    document.getElementById('cfg-nombre').value = data.nombre_tienda || '';
    document.getElementById('cfg-telefono').value = data.telefono || '';
    document.getElementById('cfg-whatsapp').value = data.whatsapp || '';
    document.getElementById('cfg-direccion').value = data.direccion || '';
    document.getElementById('cfg-horario').value = data.horario || '';
    document.getElementById('cfg-mensaje').value = data.mensaje_cliente || '';
    document.getElementById('cfg-delivery').checked = data.delivery_activo !== false;
    document.getElementById('cfg-reservas').checked = data.reservas_activas !== false;
  }

  async function saveConfig() {
    const client = sb();
    if (!client) return;
    const { error } = await client.from('configuracion_tienda').update({
      nombre_tienda: document.getElementById('cfg-nombre').value,
      telefono: document.getElementById('cfg-telefono').value,
      whatsapp: document.getElementById('cfg-whatsapp').value,
      direccion: document.getElementById('cfg-direccion').value,
      horario: document.getElementById('cfg-horario').value,
      mensaje_cliente: document.getElementById('cfg-mensaje').value,
      delivery_activo: document.getElementById('cfg-delivery').checked,
      reservas_activas: document.getElementById('cfg-reservas').checked
    }).eq('id', 1);
    if (error) toast('Error: ' + error.message);
    else toast('Configuración guardada');
  }

  function buildNav() {
    const nav = document.getElementById('admin-nav');
    nav.innerHTML = NAV.filter(n => Auth.can(n.perm)).map(n =>
      `<button type="button" data-sec="${n.id}" class="${n.id === 'dashboard' ? 'active' : ''}">${n.label}</button>`
    ).join('');
    nav.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.sec));
    });
  }

  function showSection(id) {
    document.querySelectorAll('.admin-panel-section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + id)?.classList.add('active');
    document.querySelectorAll('.admin-nav button').forEach(b => {
      b.classList.toggle('active', b.dataset.sec === id);
    });
    const item = NAV.find(n => n.id === id);
    document.getElementById('admin-page-title').textContent = item?.title || id;
    document.getElementById('admin-sidebar')?.classList.remove('open');
  }

  async function refresh() {
    await loadOrders();
    renderDashboard();
    renderPedidos();
    if (Auth.can('products')) {
      await loadProductos();
      renderProductos();
    }
    if (Auth.can('categories')) {
      await loadCategorias();
      renderCategorias();
    }
  }

  function subscribeRealtime() {
    const client = sb();
    if (!client) return;
    client.channel('admin-pedidos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => refresh())
      .subscribe();
  }

  async function init() {
    const authed = await Auth.requireAuth('login.html');
    if (!authed) return;

    const profile = Auth.getProfile();
    document.getElementById('admin-user-info').textContent =
      `${profile?.nombre || profile?.email || 'Admin'} · ${profile?.rol || ''}`;

    buildNav();
    document.getElementById('admin-logout').addEventListener('click', async () => {
      await Auth.signOut();
      location.href = 'login.html';
    });
    document.getElementById('admin-menu-toggle').addEventListener('click', () => {
      document.getElementById('admin-sidebar').classList.toggle('open');
    });
    document.getElementById('admin-refresh').addEventListener('click', refresh);

    const today = U.todayISO();
    document.getElementById('filtro-desde').value = today;
    document.getElementById('filtro-hasta').value = today;
    ['filtro-desde', 'filtro-hasta', 'filtro-estado', 'filtro-buscar'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', renderPedidos);
      document.getElementById(id)?.addEventListener('input', renderPedidos);
    });
    document.getElementById('btn-export-csv')?.addEventListener('click', exportCsv);

    document.getElementById('pedidos-tbody')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.action === 'estado') changeEstado(id);
      if (btn.dataset.action === 'print') {
        const o = orders.find(x => x.id === id);
        if (o) window.PollonTickets.print(o);
      }
    });

    if (Auth.can('products')) {
      document.getElementById('btn-nuevo-producto')?.addEventListener('click', () => openProductModal(null));
      document.getElementById('btn-save-producto')?.addEventListener('click', () => saveProducto().catch(e => toast(e.message)));
      document.getElementById('btn-close-producto')?.addEventListener('click', () => {
        document.getElementById('modal-producto').classList.remove('open');
      });
      document.getElementById('productos-tbody')?.addEventListener('click', async e => {
        const edit = e.target.closest('[data-edit-prod]');
        const del = e.target.closest('[data-del-prod]');
        if (edit) openProductModal(productos.find(p => p.id === edit.dataset.editProd));
        if (del && confirm('¿Eliminar producto?')) {
          await window.PollonProducts.adminDelete(del.dataset.delProd);
          await loadProductos();
          renderProductos();
        }
      });
    }

    if (Auth.can('settings')) {
      await loadConfig();
      document.getElementById('btn-save-config')?.addEventListener('click', () => saveConfig());
    }

    await refresh();
    subscribeRealtime();
    document.getElementById('admin-loader').classList.add('hidden');
  }

  init().catch(e => {
    console.error(e);
    document.getElementById('admin-loader').innerHTML = '<p>Error al cargar. <a href="login.html">Volver</a></p>';
  });
})();
