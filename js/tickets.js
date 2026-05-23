/**
 * Impresión de tickets — El Pollón
 */
window.PollonTickets = (function () {
  'use strict';

  const LINE = 35;

  function wrapText(text, maxLen) {
    const len = maxLen || LINE;
    const str = String(text || '').trim();
    if (!str) return '';
    const lines = [];
    let remaining = str;
    while (remaining.length > 0) {
      if (remaining.length <= len) {
        lines.push(remaining);
        break;
      }
      let chunk = remaining.slice(0, len);
      const sp = chunk.lastIndexOf(' ');
      if (sp > 0) {
        chunk = chunk.slice(0, sp);
        remaining = remaining.slice(sp + 1).trim();
      } else {
        remaining = remaining.slice(len);
      }
      lines.push(chunk);
    }
    return lines.join('\n');
  }

  function buildText(order) {
    const U = window.PollonUtils;
    const money = U ? U.money.bind(U) : (v) => '$' + v;
    const cust = order.customer || {};
    const items = order.items || [];
    const fecha = order.createdAt ? new Date(order.createdAt) : new Date();
    const fechaStr = fecha.toLocaleDateString('es-CL');
    const horaStr = fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    const codigo = order.codigo_pedido || order.ticketNumber || order.id || '---';

    let msg = '';
    msg += '◆ POLLERÍA EL POLLÓN ◆\n\n';
    msg += `Pedido: ${codigo}  ${fechaStr} ${horaStr}\n`;
    msg += `Tipo: ${(order.orderType || 'delivery').toUpperCase()}\n`;
    msg += '────────────────────────────────\n';
    msg += `Cliente: ${cust.name || '-'}\n`;
    msg += `Tel: ${cust.phone || '-'}\n`;
    const addr = wrapText(cust.address);
    if (addr) msg += `Dir:\n${addr.split('\n').map(l => '  ' + l).join('\n')}\n`;
    if (cust.comments) {
      msg += `Obs:\n${wrapText(cust.comments).split('\n').map(l => '  ' + l).join('\n')}\n`;
    }
    msg += '────────────────────────────────\n';
    items.forEach((it, i) => {
      msg += `${i + 1}. ${it.name} x${it.qty || 1}\n`;
      if (it.drink) msg += `   Bebida: ${it.drink}\n`;
      if (it.bagQty) msg += `   Bolsa: x${it.bagQty}\n`;
      msg += `   ${money(it.total)}\n`;
    });
    msg += '────────────────────────────────\n';
    msg += `TOTAL: ${money(order.total)}\n`;
    msg += '◆ Delivery: costo según zona\n';
    return msg;
  }

  function print(order) {
    const contenido = buildText(order);
    const win = window.open('', '_blank', 'width=400,height=640');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Ticket ${order.id}</title>
      <style>body{font-family:monospace;font-size:12px;padding:10px;white-space:pre-wrap}</style></head>
      <body>${contenido.replace(/</g, '&lt;')}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  return { buildText, print, wrapText };
})();
