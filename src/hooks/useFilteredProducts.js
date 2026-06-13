import { useMemo } from 'react';
import { useAppStore } from '@/store/appStore';

export function useFilteredProducts() {
  const products = useAppStore((s) => s.products);
  const currentCategory = useAppStore((s) => s.currentCategory);
  const searchTerm = useAppStore((s) => s.searchTerm);

  return useMemo(() => {
    let list = products.filter((p) => p.available !== false);
    if (currentCategory && currentCategory !== 'todo-el-menu') {
      list = list.filter((p) => p.category_slug === currentCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, currentCategory, searchTerm]);
}
