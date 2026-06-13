import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import ProductCustomizeModal from '@/components/ProductCustomizeModal';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';
import { useAppStore } from '@/store/appStore';
import { useCartStore } from '@/store/cartStore';

const CUSTOMIZE_CATEGORIES = ['ofertas-familiares', 'ofertas-dos', 'ofertas-personales', 'platos-extras', 'agregados'];

export default function MenuPage() {
  const products = useFilteredProducts();
  const currentCategory = useAppStore((s) => s.currentCategory);
  const showToast = useAppStore((s) => s.showToast);
  const addItem = useCartStore((s) => s.addItem);
  const [selected, setSelected] = useState(null);

  const handleAdd = (product) => {
    const slug = product.category_slug || currentCategory;
    if (CUSTOMIZE_CATEGORIES.includes(slug)) {
      setSelected({ product, categorySlug: slug });
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        total: product.price,
        categorySlug: slug,
      });
      showToast('¡Producto agregado al carrito!');
    }
  };

  return (
    <AppLayout>
      <CategoryTabs />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-12">No hay productos en esta categoría.</p>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)
        )}
      </div>
      {selected && (
        <ProductCustomizeModal
          product={selected.product}
          categorySlug={selected.categorySlug}
          onClose={() => setSelected(null)}
        />
      )}
    </AppLayout>
  );
}
