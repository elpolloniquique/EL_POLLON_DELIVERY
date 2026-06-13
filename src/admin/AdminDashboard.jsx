import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { fetchOrders, computeSalesStats } from '@/services/orders-service';
import { formatMoney } from '@/utils/format';
import { ORDER_STATUS_LABELS } from '@/lib/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const stats = computeSalesStats(orders);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const salesByDay = last7.map((day) =>
    orders.filter((o) => (o.created_at || '').slice(0, 10) === day).reduce((s, o) => s + Number(o.total), 0)
  );

  const statusCounts = {};
  orders.forEach((o) => {
    const s = o.status || 'pendiente';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  if (loading) return <p>Cargando dashboard…</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pedidos hoy', value: stats.todayCount, color: 'text-pollon-red' },
          { label: 'Ventas hoy', value: formatMoney(stats.todaySales), color: 'text-green-600' },
          { label: 'Ventas semana', value: formatMoney(stats.weekSales), color: 'text-blue-600' },
          { label: 'Ventas mes', value: formatMoney(stats.monthSales), color: 'text-purple-600' },
          { label: 'Total pedidos', value: stats.totalOrders },
          { label: 'Pendientes', value: stats.pending },
          { label: '% Entregados', value: `${stats.deliveredPct}%` },
          { label: 'Ticket promedio', value: formatMoney(stats.avgTicket) },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color || ''}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-bold mb-3">Ventas últimos 7 días</h3>
          <Bar
            data={{
              labels: last7.map((d) => d.slice(5)),
              datasets: [{ label: 'Ventas', data: salesByDay, backgroundColor: '#e10600' }],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
        <div className="card p-4">
          <h3 className="font-bold mb-3">Pedidos por estado</h3>
          <Doughnut
            data={{
              labels: Object.keys(statusCounts).map((k) => ORDER_STATUS_LABELS[k] || k),
              datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444'],
              }],
            }}
          />
        </div>
      </div>
    </div>
  );
}
