const CURRENCY = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function formatMoney(value) {
  return CURRENCY.format(Number(value) || 0);
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const TICKET_LINE_LENGTH = 35;

export function wrapText(text, maxLen = TICKET_LINE_LENGTH) {
  const str = String(text || '').trim();
  if (!str) return '';
  const lines = [];
  let remaining = str;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      lines.push(remaining);
      break;
    }
    let chunk = remaining.slice(0, maxLen);
    const lastSpace = chunk.lastIndexOf(' ');
    if (lastSpace > 0) {
      chunk = chunk.slice(0, lastSpace);
      remaining = remaining.slice(lastSpace + 1).trim();
    } else {
      remaining = remaining.slice(maxLen);
    }
    lines.push(chunk);
  }
  return lines.join('\n');
}

export function generateOrderId() {
  return `P${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function generateTicketNumber(existingCount = 0) {
  return String(existingCount + 1).padStart(3, '0');
}

export function normalizeStatus(status) {
  if (!status) return 'pendiente';
  const raw = String(status).trim().toLowerCase().replace(/\s+/g, '_');
  const aliases = {
    confirmado: 'preparando',
    listo: 'preparando',
    en_preparación: 'preparando',
    en_preparacion: 'preparando',
    pendiente: 'pendiente',
    preparando: 'preparando',
    en_delivery: 'en_delivery',
    entregado: 'entregado',
    cancelado: 'cancelado',
  };
  return aliases[raw] || raw;
}

export function nextStatus(current) {
  const statuses = ['pendiente', 'preparando', 'en_delivery', 'entregado', 'cancelado'];
  const idx = statuses.indexOf(normalizeStatus(current));
  return statuses[(idx >= 0 ? idx + 1 : 0) % statuses.length];
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function exportOrdersToCSV(orders) {
  const headers = ['ID', 'Ticket', 'Cliente', 'Teléfono', 'Dirección', 'Total', 'Estado', 'Fecha', 'Tipo'];
  const rows = orders.map((o) => {
    const c = o.customer || {};
    return [
      o.id,
      o.ticket_number || '',
      c.name || '',
      c.phone || '',
      (c.address || '').replace(/,/g, ' '),
      o.total,
      o.status,
      o.created_at,
      o.order_type || 'delivery',
    ];
  });
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pedidos-pollon-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildWhatsappMessage(order, settings = {}, policies = {}) {
  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const total = order.total ?? 0;
  const fechaBase = order.created_at ? new Date(order.created_at) : new Date();
  const fechaStr = fechaBase.toLocaleDateString('es-CL');
  const horaStr = fechaBase.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  const ticket = String(order.ticket_number || '1').padStart(3, '0');
  const waPolicy = policies.whatsapp?.content || {};
  const bagPrice = 200;

  let msg = `${waPolicy.orderHeader || '◆ DELIVERY - POLLERÍA EL POLLÓN ◆'}\n\n`;
  msg += `${ticket}    ${fechaStr}    ${horaStr}\n`;
  msg += `────────────────────────────────\n`;
  msg += `◆ DATOS DEL CLIENTE\n`;
  msg += `────────────────────────────────\n\n`;
  msg += `◆ Nombre:   ${customer.name || '-'}\n`;
  msg += `◆ Teléfono: ${customer.phone || '-'}\n`;
  const addrWrapped = wrapText(customer.address);
  msg += `◆ Dirección:\n${addrWrapped ? addrWrapped.split('\n').map((l) => '   ' + l).join('\n') : '   -'}\n\n`;
  if ((customer.comments || '').trim()) {
    const commentsWrapped = wrapText(customer.comments);
    msg += `◆ Comentarios:\n${commentsWrapped.split('\n').map((l) => '   ' + l).join('\n')}\n\n`;
  }
  msg += `────────────────────────────────\n`;
  msg += `◆ DETALLE DEL PEDIDO\n`;
  msg += `────────────────────────────────\n\n`;
  items.forEach((it, i) => {
    msg += `${i + 1}. ${it.name} × ${it.qty || 1}\n`;
    msg += `— Subtotal: ${formatMoney(it.total)}\n`;
    if (it.drink) msg += `— Bebida: ${it.drink}\n`;
    if ((it.bagQty || 0) > 0) msg += `— Bolsa: x ${it.bagQty} (+ ${formatMoney(bagPrice)} /u)\n`;
    msg += '\n';
  });
  msg += `────────────────────────────────\n`;
  msg += `◆ TOTAL A PAGAR: ${formatMoney(total)}\n`;
  msg += `────────────────────────────────\n\n`;
  msg += waPolicy.deliveryNote || '◆ Delivery tiene costo adicional\n◆ según la distancia $2.500 a $4.000';
  return msg;
}

export function openWhatsapp(number, text) {
  const clean = String(number).replace(/\D/g, '');
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
