import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useGuestStore = create()(
  persist(
    (set, get) => ({
      guests: [],
      loading: false,

      fetchGuests: async () => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          set({ guests: data.map(g => ({
            ...g,
            tabAmount: parseFloat(g.tab_amount || 0),
            checkIn: g.check_in
          })), loading: false });
        } else {
          set({ loading: false });
        }
      },

      addGuest: async (guestData) => {
        const newGuest = { 
          name: guestData.name, 
          wristband: guestData.wristband || '',
          adults: guestData.adults || 1,
          children: guestData.children || 0,
          status: 'active',
          tab_amount: 0,
          check_in: new Date().toISOString()
        };

        // Supabase Sync
        const { data, error } = await supabase
          .from('clients')
          .insert([newGuest])
          .select();

        if (!error && data) {
          const createdGuest = { ...data[0], tabAmount: parseFloat(data[0].tab_amount), checkIn: data[0].check_in };
          set((state) => ({
            guests: [createdGuest, ...state.guests]
          }));
          return createdGuest;
        } else {
          // Fallback to local if error (optional)
          const localGuest = { ...newGuest, id: Date.now().toString(), tabAmount: 0, checkIn: newGuest.check_in };
          set((state) => ({
            guests: [localGuest, ...state.guests]
          }));
          return localGuest;
        }
      },

      updateGuest: async (id, data) => {
        set((state) => ({
          guests: state.guests.map(g => g.id === id ? { ...g, ...data } : g)
        }));

        await supabase
          .from('clients')
          .update(data)
          .eq('id', id);
      },

      checkoutGuest: async (id, paymentMethod = 'card') => {
        const guest = get().guests.find(g => g.id === id);
        if (!guest) return;

        // Mark as checked out in Supabase
        await supabase
          .from('clients')
          .update({ status: 'checked_out', tab_amount: 0 })
          .eq('id', id);

        set((state) => ({
          guests: state.guests.map(g => g.id === id ? { ...g, status: 'checked_out', tabAmount: 0 } : g)
        }));
      },

      addChargeToTab: async (id, amount) => {
        const guest = get().guests.find(g => g.id === id);
        if (!guest) return;

        const newAmount = (guest.tabAmount || 0) + amount;

        set((state) => ({
          guests: state.guests.map(g => g.id === id ? { ...g, tabAmount: newAmount } : g)
        }));

        await supabase
          .from('clients')
          .update({ tab_amount: newAmount })
          .eq('id', id);
          
        // Log detailed item charge if needed
        await supabase
          .from('client_tab_items')
          .insert([{ 
            client_id: id, 
            concept: 'Consumo POS', 
            amount: amount,
            qty: 1
          }]);
      }

    }),
    { name: 'fintech-guest-store' }
  )
);
