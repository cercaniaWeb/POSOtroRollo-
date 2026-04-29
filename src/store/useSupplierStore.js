import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSupplierStore = create()(
  persist(
    (set) => ({
      suppliers: [
        { id: '1', name: 'Distribuidora del Centro', rfc: 'DISC123456789', contact: 'Juan Pérez', phone: '555-0123', email: 'ventas@distribuidora.com', address: 'Av. Central 123' },
        { id: '2', name: 'Bebidas Globales SA', rfc: 'BEBG987654321', contact: 'María López', phone: '555-0987', email: 'contacto@bebidasglobales.com', address: 'Calle Sur 456' },
      ],
      addSupplier: (supplier) => set((state) => ({
        suppliers: [...state.suppliers, { ...supplier, id: Date.now().toString() }]
      })),
      updateSupplier: (id, updatedSupplier) => set((state) => ({
        suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updatedSupplier } : s)
      })),
      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter(s => s.id !== id)
      }))
    }),
    { name: 'fintech-supplier-store' }
  )
);
