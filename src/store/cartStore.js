import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      addItem: (item) => {
        const items = [...get().items, { ...item, cartId: `${Date.now()}-${Math.random()}` }];
        set({ items });
      },

      removeItem: (cartId) => {
        set({ items: get().items.filter((i) => i.cartId !== cartId) });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => get().items.reduce((sum, i) => sum + (i.total || 0), 0),
      getCount: () => get().items.reduce((sum, i) => sum + (i.qty || 1), 0),
    }),
    { name: 'pollon-cart-v2' }
  )
);
