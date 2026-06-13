import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAppStore } from '@/store/appStore';
import { formatMoney } from '@/utils/format';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);
  const showToast = useAppStore((s) => s.showToast);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!isOpen) return checkoutOpen ? <CheckoutModal onClose={() => { setCheckoutOpen(false); closeCart(); }} /> : null;

  const total = getTotal();

  return (
    <>
      <div className="fixed inset-0 z-[55] flex justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
        <aside className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] h-full flex flex-col animate-slide-up safe-bottom">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold">🛒 Tu Carrito</h2>
            <button type="button" onClick={closeCart} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Tu carrito está vacío</p>
            ) : (
              items.map((item) => (
                <div key={item.cartId} className="card p-4 flex gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">× {item.qty}</p>
                    {item.drink && <p className="text-xs text-gray-500">Bebida: {item.drink}</p>}
                    {item.bagQty > 0 && <p className="text-xs text-gray-500">Bolsa × {item.bagQty}</p>}
                    <p className="text-pollon-red font-bold mt-1">{formatMoney(item.total)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { removeItem(item.cartId); showToast('Producto eliminado'); }}
                    className="text-red-500 text-sm self-start"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-pollon-red">{formatMoney(total)}</span>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                className="btn-primary w-full text-base"
              >
                💬 Realizar Pedido por WhatsApp
              </button>
            </div>
          )}
        </aside>
      </div>
      {checkoutOpen && <CheckoutModal onClose={() => { setCheckoutOpen(false); closeCart(); }} />}
    </>
  );
}
