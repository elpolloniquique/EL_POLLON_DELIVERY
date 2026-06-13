import { useEffect, useState, useCallback } from 'react';
import {
  fetchOrders,
  filterOrders,
  updateOrderStatus,
  subscribeOrders,
} from '@/services/orders-service';
import { formatMoney, formatDateTime, exportOrdersToCSV, openWhatsapp, buildWhatsappMessage, nextStatus } from '@/utils/format';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, DRIVERS } from '@/lib/constants';
import { useAppStore } from '@/store/appStore';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', status: '', search: '', driver: '', hourFrom: '', hourTo: '' });
  const settings = useAppStore((s) => s.settings);
  const policies = useAppStore((s) => s.policies);

  const load = useCallback(() => fetchOrders().then(setOrders), []);

  useEffect(() => {
    load();
    return subscribeOrders(setOrders);
  }, [load]);

  const filtered = filterOrders(orders, filters);

  const handleStatus = async (id, current) => {
    const newStatus = nextStatus(current);
    await updateOrderStatus(id, newStatus);
    load();
  };

  const handleDriver = async (id, driver) => {
    await updateOrderStatus(id, undefined, { driver });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <input type="date" className="admin-input" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
          <input type="date" className="admin-input" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
          <input type="time" className="admin-input" value={filters.hourFrom} onChange={(e) => setFilters({ ...filters, hourFrom: e.target.value })} />
          <input type="time" className="admin-input" value={filters.hourTo} onChange={(e) => setFilters({ ...filters, hourTo: e.target.value })} />
          <select className="admin-input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Todos estados</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
          </select>
          <select className="admin-input" value={filters.driver} onChange={(e) => setFilters({ ...filters, driver: e.target.value })}>
            <option value="">Repartidor — todos</option>
            {DRIVERS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="search" className="admin-input flex-1 min-w-[200px]" placeholder="Buscar cliente o teléfono" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <button type="button" onClick={() => exportOrdersToCSV(filtered)} className="btn-primary text-sm py-2">Exportar CSV</button>
          <button type="button" onClick={load} className="btn-secondary text-sm py-2">🔃 Actualizar</button>
        </div>
        <p className="text-sm text-gray-500 mb-3">{filtered.length} pedidos en el rango</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                <th className="py-2 pr-2">Ticket</th>
                <th className="py-2 pr-2">Cliente</th>
                <th className="py-2 pr-2">Total</th>
                <th className="py-2 pr-2">Estado</th>
                <th className="py-2 pr-2">Fecha</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">No hay pedidos</td></tr>
              ) : filtered.map((o) => {
                const c = o.customer || {};
                return (
                  <tr key={o.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-2 font-mono text-xs">{o.ticket_number || o.id?.slice(-6)}</td>
                    <td className="py-2 pr-2">
                      <div>{c.name}</div>
                      <div className="text-xs text-gray-500">{c.phone}</div>
                    </td>
                    <td className="py-2 pr-2 font-semibold">{formatMoney(o.total)}</td>
                    <td className="py-2 pr-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800`}>
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="py-2 pr-2 text-xs">{formatDateTime(o.created_at)}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        <button type="button" onClick={() => handleStatus(o.id, o.status)} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Estado</button>
                        <select className="admin-input text-xs w-24" value={o.driver || ''} onChange={(e) => handleDriver(o.id, e.target.value)}>
                          <option value="">Repartidor</option>
                          {DRIVERS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => openWhatsapp(c.phone || settings.whatsapp, buildWhatsappMessage(o, settings, policies))}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                        >
                          WA
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
