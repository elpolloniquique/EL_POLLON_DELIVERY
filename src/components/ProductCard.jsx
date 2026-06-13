import { formatMoney } from '@/utils/format';

export default function ProductCard({ product, onAdd }) {
  const img = product.image_url || product.image || '/img/todo el menu.png';

  return (
    <article className="card animate-fade-in group">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = '/img/todo el menu.png'; }}
        />
        {product.promotion && (
          <span className="absolute top-2 left-2 bg-pollon-gold text-pollon-black text-xs font-bold px-2 py-1 rounded-full">
            PROMO
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{product.description}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-pollon-red">{formatMoney(product.price)}</span>
          <button type="button" onClick={() => onAdd(product)} className="btn-primary text-sm py-2 px-4 rounded-xl">
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
