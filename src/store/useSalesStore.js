import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSalesStore = create()(
  persist(
    (set, get) => ({
      sales: [
        { id: '1001', type: 'order', date: new Date(Date.now() - 3600000).toISOString(), concept: 'Venta Punto de Caja', amount: 350.00, method: 'cash' },
        { id: '1002', type: 'checkout', date: new Date(Date.now() - 7200000).toISOString(), concept: 'Checkout Habitación 204', amount: 1240.50, method: 'card' },
      ],
      
      addSale: (sale) => set((state) => ({
        sales: [
          {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...sale
          },
          ...state.sales
        ]
      })),

      // Reset for Corte de Caja
      clearSales: () => set({ sales: [] })
    }),
    { name: 'fintech-sales-store' }
  )
);
