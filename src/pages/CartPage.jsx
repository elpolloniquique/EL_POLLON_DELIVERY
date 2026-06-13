import { useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useCartStore } from '@/store/cartStore';
import { formatMoney } from '@/utils/format';
import CheckoutModal from '@/components/CheckoutModal';
import { useState } from 'react';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);
  const openCart = useCartStore((s) => s.openCart);
  const [checkout, setCheckout] = useState(false);

  useEffect(() => { openCart(); }, [openCart]);

  return (
    <AppLayout>
      <h2 className="text-xl font-bold mt-2 mb-4">🛒 Mi Carrito</h2>
      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Tu carrito está vacío</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.cartId} className="card p-4 flex justify-between">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">× {item.qty} — {formatMoney(item.total)}</p>
              </div>
              <button type="button" onClick={() => removeItem(item.cartId)} className="text-red-500 text-sm">Eliminar</button>
            </div>
          ))}
          <div className="card p-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-pollon-red">{formatMoney(getTotal())}</span>
            </div>
            <button type="button" onClick={() => setCheckout(true)} className="btn-primary w-full mt-3">
              💬 Realizar Pedido por WhatsApp
            </button>
          </div>
        </div>
      )}
      {checkout && <CheckoutModal onClose={() => setCheckout(false)} />}
    </AppLayout>
  );
}
