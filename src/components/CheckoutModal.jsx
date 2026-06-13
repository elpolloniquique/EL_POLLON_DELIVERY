import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAppStore } from '@/store/appStore';
import { createOrder, fetchOrders } from '@/services/orders-service';
import { buildWhatsappMessage, formatMoney, openWhatsapp } from '@/utils/format';

export default function CheckoutModal({ onClose }) {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const settings = useAppStore((s) => s.settings);
  const policies = useAppStore((s) => s.policies);
  const showToast = useAppStore((s) => s.showToast);

  const [form, setForm] = useState({ name: '', phone: '', address: '', comments: '' });
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      showToast('Completa nombre, teléfono y dirección');
      return;
    }
    setLoading(true);
    try {
      const existing = await fetchOrders();
      const order = {
        customer: form,
        items,
        total,
        order_type: 'delivery',
      };
      const saved = await createOrder(order, existing.length);
      const msg = buildWhatsappMessage(saved, settings, policies);
      openWhatsapp(settings.whatsapp || '56986925310', msg);
      clearCart();
      showToast('✅ ¡Pedido enviado a WhatsApp y guardado!');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Error al guardar pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg bg-white dark:bg-[#1c1c1c] rounded-t-3xl sm:rounded-3xl p-5 animate-slide-up max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">📝 Datos de Entrega</h2>

        <div className="space-y-3 mb-4">
          <label className="block">
            <span className="text-sm font-medium">Nombre Completo</span>
            <input
              className="input-field mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Juan Pérez"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Teléfono</span>
            <input
              className="input-field mt-1"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+56 9 8692 5310"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Dirección de Entrega</span>
            <input
              className="input-field mt-1"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Ej: Av. Principal 123, Iquique"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Comentarios (opcional)</span>
            <textarea
              className="input-field mt-1 min-h-[80px]"
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              placeholder="Ej: más ají, pollo trocado en 8..."
            />
          </label>
        </div>

        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total pedido:</span>
          <span className="text-pollon-red">{formatMoney(total)}</span>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Enviando…' : '📤 Enviar Mi Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
}
