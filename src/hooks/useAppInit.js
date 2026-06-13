import { useEffect } from 'react';
import {
  fetchSettings,
  fetchCategories,
  fetchProducts,
  fetchBanners,
  fetchDeliveryZones,
  fetchProductOptions,
  fetchPromotions,
} from '@/services/settings-service';
import { useAppStore } from '@/store/appStore';

export function useAppInit() {
  const setAppData = useAppStore((s) => s.setAppData);
  const darkMode = useAppStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [config, categories, products, banners, zones, options, promotions] = await Promise.all([
          fetchSettings(),
          fetchCategories(),
          fetchProducts(),
          fetchBanners(),
          fetchDeliveryZones(),
          fetchProductOptions(),
          fetchPromotions(),
        ]);
        if (!cancelled) {
          setAppData({
            settings: config.settings,
            policies: config.policies,
            categories,
            products,
            banners,
            zones,
            options,
            promotions,
          });
        }
      } catch (e) {
        console.error('[Pollón] Error cargando datos:', e);
        if (!cancelled) setAppData({ loading: false });
      }
    })();
    return () => { cancelled = true; };
  }, [setAppData]);
}
