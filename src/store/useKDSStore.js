import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useKDSStore = create()(
  persist(
    (set, get) => ({
      orders: [],

      // Añadir una orden desde el POS a la cocina
      addOrder: (cartItems, tableInfo = 'Para llevar', waiter = 'Mostrador') => set((state) => ({
        orders: [
          ...state.orders,
          {
            id: Date.now().toString(),
            table: tableInfo,
            waiter,
            status: 'recibido', // Estados: recibido, en_preparacion, listo, entregado
            timestamp: new Date().toISOString(),
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.qty,
              notes: item.notes || ''
            }))
          }
        ]
      })),

      // Actualizar el estado de la orden
      updateOrderStatus: (orderId, newStatus) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      })),

      // Limpiar ordenes completadas o todas (para debug)
      clearOrders: () => set({ orders: [] })
    }),
    { name: 'fintech-kds-orders' }
  )
);
