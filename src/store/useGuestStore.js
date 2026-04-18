import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGuestStore = create()(
  persist(
    (set, get) => ({
      guests: [
        // Mock data initial state
        { id: '1', name: 'Familia Ramírez', wristband: 'VIP-001', adults: 2, children: 1, tabAmount: 1450.50, status: 'active', checkIn: new Date().toISOString() },
        { id: '2', name: 'Carlos Slim', wristband: 'DAY-042', adults: 1, children: 0, tabAmount: 320.00, status: 'active', checkIn: new Date().toISOString() }
      ],

      addGuest: (guestData) => set((state) => ({
        guests: [...state.guests, { ...guestData, id: Date.now().toString(), tabAmount: 0, status: 'active', checkIn: new Date().toISOString() }]
      })),

      updateGuest: (id, data) => set((state) => ({
        guests: state.guests.map(g => g.id === id ? { ...g, ...data } : g)
      })),

      checkoutGuest: (id) => set((state) => ({
        guests: state.guests.map(g => g.id === id ? { ...g, status: 'checked_out', tabAmount: 0 } : g)
      })),

      addChargeToTab: (id, amount) => set((state) => ({
        guests: state.guests.map(g => g.id === id ? { ...g, tabAmount: g.tabAmount + amount } : g)
      }))

    }),
    { name: 'fintech-guest-store' }
  )
);
