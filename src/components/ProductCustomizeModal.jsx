import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useCartStore } from '@/store/cartStore';
import { BAG_RULES, DRINK_REQUIRED } from '@/data/fallback';
import { formatMoney } from '@/utils/format';

export default function ProductCustomizeModal({ product, categorySlug, onClose }) {
  const options = useAppStore((s) => s.options);
  const showToast = useAppStore((s) => s.showToast);
  const addItem = useCartStore((s) => s.addItem);

  const [qty, setQty] = useState(1);
  const [drink, setDrink] = useState('');
  const [withBag, setWithBag] = useState(null);

  const bagRules = BAG_RULES[categorySlug] || { optional: true };
  const drinkRequired = DRINK_REQUIRED.includes(categorySlug);
  const drinks = options.filter((o) => o.option_type === 'drink' && (!o.category_slug || o.category_slug === categorySlug));
  const bagPrice = options.find((o) => o.option_type === 'bag')?.price || 200;

  const bagQty = withBag ? (bagRules.perUnit ? qty : 1) : 0;
  const itemTotal = product.price * qty + bagQty * bagPrice;

  const handleConfirm = () => {
    if (drinkRequired && !drink) {
      showToast('⚠️ Debes seleccionar un sabor de bebida.');
      return;
    }
    if (bagRules.required && withBag === null) {
      showToast('⚠️ Debes elegir opción de bolsa.');
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
      drink: drink || null,
      bagQty,
      total: itemTotal,
      categorySlug,
    });
    showToast('¡Producto agregado al carrito!');
    onClose();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1c1c1c] rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold">Personaliza tu pedido</h2>
          <p className="text-sm text-gray-500">{product.name}</p>
        </div>

        <div className="p-5 space-y-5">
          {drinks.length > 0 && (
            <section>
              <h3 className="font-semibold text-sm mb-2">
                BEBIDAS {drinkRequired && <span className="text-pollon-red text-xs">(Obligatorio)</span>}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {drinks.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDrink(d.value)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition ${
                      drink === d.value
                        ? 'border-pollon-red bg-pollon-red/10 text-pollon-red'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {!bagRules.hidden && (
            <section>
              <h3 className="font-semibold text-sm mb-2">
                BOLSA ECOLÓGICA (+{formatMoney(bagPrice)})
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWithBag(true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${
                    withBag === true ? 'border-pollon-red bg-pollon-red/10' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  Agregar bolsa
                </button>
                <button
                  type="button"
                  onClick={() => setWithBag(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${
                    withBag === false ? 'border-pollon-red bg-pollon-red/10' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  Sin bolsa
                </button>
              </div>
            </section>
          )}

          <section className="flex items-center justify-between">
            <span className="font-medium">Cantidad:</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-xl font-bold">−</button>
              <span className="text-xl font-bold w-8 text-center">{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-full bg-pollon-red text-white text-xl font-bold">+</button>
            </div>
          </section>

          <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
            <span>Total:</span>
            <span className="text-pollon-red">{formatMoney(itemTotal)}</span>
          </div>
        </div>

        <div className="p-5 flex gap-3 border-t border-gray-100 dark:border-gray-800">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button type="button" onClick={handleConfirm} className="btn-primary flex-1">Agregar al Carrito</button>
        </div>
      </div>
    </div>
  );
}
