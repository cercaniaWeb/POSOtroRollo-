import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInventoryStore = create()(
  persist(
    (set) => ({
      products: [
        { id: '1', name: "Enchiladas Suizas", price: 120, category: "Cocina", stock: Infinity },
        { id: '2', name: "Chilaquiles Verdes", price: 110, category: "Cocina", stock: Infinity },
        { id: '7', name: "Refresco Cola 600ml", price: 25, category: "Tienda", stock: 15 },
        { id: '8', name: "Agua Mineral", price: 20, category: "Tienda", stock: 12 },
        { id: '10', name: "Membresía Premium", price: 1200, category: "Servicios", stock: Infinity },
        { id: '11', name: "Kit de Bienvenida", price: 450, category: "Productos", stock: 50 },
      ],
      categories: ["Cocina", "Tienda", "Servicios", "Productos"],
      lowStockThreshold: 10,
      
      addProduct: (product) => set((state) => ({ 
        products: [...state.products, { ...product, id: product.id || Date.now().toString() }] 
      })),
      
      updateProduct: (id, updatedData) => set((state) => ({
        products: state.products.map(p => String(p.id) === String(id) ? { ...p, ...updatedData } : p)
      })),

      removeProduct: (id) => set((state) => ({
        products: state.products.filter(p => String(p.id) !== String(id))
      })),
      
      updateStock: (productId, qty) => set((state) => ({
        products: state.products.map(p => 
          p.id === productId ? { ...p, stock: p.stock - qty } : p
        )
      })),
    }),
    { name: 'fintech-pos-inventory' }
  )
);
