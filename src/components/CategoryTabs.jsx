import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/format';

export default function CategoryTabs() {
  const categories = useAppStore((s) => s.categories);
  const currentCategory = useAppStore((s) => s.currentCategory);
  const setCurrentCategory = useAppStore((s) => s.setCurrentCategory);

  const navCategories = categories.filter((c) => c.show_in_nav !== false && c.active !== false);

  return (
    <div className="sticky top-[var(--header-offset,120px)] z-30 bg-gray-50/95 dark:bg-pollon-black/95 backdrop-blur-sm py-3 -mx-4 px-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {navCategories.map((cat) => {
          const slug = cat.slug;
          const active = currentCategory === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => setCurrentCategory(slug)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
                active
                  ? 'bg-pollon-red text-white shadow-float'
                  : 'bg-white dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              )}
            >
              <span>{cat.icon}</span>
              <span className="whitespace-nowrap">{cat.short_title || cat.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
