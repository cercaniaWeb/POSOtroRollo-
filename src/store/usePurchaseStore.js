import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePurchaseStore = create()(
  persist(
    (set) => ({
      purchases: [],
      addPurchase: (purchase) => set((state) => ({
        purchases: [
          {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...purchase
          },
          ...state.purchases
        ]
      }))
    }),
    { name: 'fintech-purchase-store' }
  )
);
