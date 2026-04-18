import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUIStore } from './useUIStore';

export const usePOSStore = create()(
  persist(
    (set, get) => ({
      cart: [],
      activeSale: {
        customer: null,
        discount: 0,
        tip: 0,
        paymentMethod: 'cash',
      },

      addToCart: (product) => set((state) => {
        const existing = state.cart.find(i => i.id === product.id);
        if (existing) {
          if (product.stock !== Infinity && existing.qty + 1 > product.stock) {
            useUIStore.getState().addToast(`Stock insuficiente para ${product.name}`, 'error');
            return state;
          }
          useUIStore.getState().addToast(`Añadido: ${product.name} (x${existing.qty + 1})`);
          return {
            cart: state.cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
          };
        }
        useUIStore.getState().addToast(`Añadido: ${product.name}`);
        return { cart: [...state.cart, { ...product, qty: 1 }] };
      }),

      updateQty: (productId, delta) => set((state) => ({
        cart: state.cart.map(i => {
          if (i.id === productId) {
            const newQty = i.qty + delta;
            if (newQty <= 0) return null;
            if (i.stock !== Infinity && newQty > i.stock) {
              useUIStore.getState().addToast(`Stock insuficiente`, 'error');
              return i;
            }
            return { ...i, qty: newQty };
          }
          return i;
        }).filter(Boolean)
      })),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(i => i.id !== productId)
      })),

      clearCart: () => set({ cart: [] }),

      // Calculos Fintech (Basado en el diseño "The Digital Private Bank")
      getCalculations: () => {
        const { cart, activeSale } = get();
        const totalRaw = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
        const subtotal = totalRaw / 1.16; // Asumiendo que el precio ya tiene IVA e invertimos el calculo
        const tax = totalRaw - subtotal;
        const total = totalRaw + activeSale.tip - activeSale.discount;

        return {
          subtotal,
          tax,
          total,
          itemsCount: cart.reduce((acc, i) => acc + i.qty, 0)
        };
      }
    }),
    { name: 'fintech-pos-cart' }
  )
);
