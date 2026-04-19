import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCabinStore = create()(
  persist(
    (set) => ({
      cabins: [
        { id: '1', number: '101', type: 'Estándar', status: 'available', price: 850, capacity: 2, charges: [] },
        { id: '2', number: '102', type: 'Estándar', status: 'occupied', price: 850, capacity: 2, currentGuest: 'Juan Pérez', charges: [] },
        { id: '3', number: '201', type: 'Suite', status: 'available', price: 1500, capacity: 4, charges: [] },
        { id: '4', number: '202', type: 'Suite', status: 'cleaning', price: 1500, capacity: 4, charges: [] },
        { id: '5', number: '301', type: 'Familiar', status: 'maintenance', price: 2200, capacity: 6, charges: [] },
        { id: '6', number: '302', type: 'Familiar', status: 'available', price: 2200, capacity: 6, charges: [] },
      ],
      
      cabinTypes: ['Estándar', 'Suite', 'Familiar', 'Deluxe'],
      
      addCabin: (cabin) => set((state) => ({ 
        cabins: [...state.cabins, { ...cabin, id: Date.now().toString(), charges: [] }] 
      })),
      
      updateCabin: (id, updatedData) => set((state) => ({
        cabins: state.cabins.map(c => c.id === id ? { ...c, ...updatedData } : c)
      })),
      
      updateCabinStatus: (id, status, guestName = null) => set((state) => ({
        cabins: state.cabins.map(c => 
          c.id === id ? { ...c, status, currentGuest: guestName, charges: status === 'available' ? [] : c.charges } : c
        )
      })),

      addCharge: (id, charge) => set((state) => ({
        cabins: state.cabins.map(c => 
          c.id === id ? { ...c, charges: [...(c.charges || []), { ...charge, date: new Date().toISOString() }] } : c
        )
      })),

      clearCharges: (id) => set((state) => ({
        cabins: state.cabins.map(c => c.id === id ? { ...c, charges: [] } : c)
      })),

      removeCabin: (id) => set((state) => ({
        cabins: state.cabins.filter(c => c.id !== id)
      })),
    }),
    { name: 'el-otro-rollo-cabins' }
  )
);
