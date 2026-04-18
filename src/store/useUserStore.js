import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      users: [
        { id: '1', name: 'Administrador', role: 'admin', pin: '1234', color: 'bg-primary' },
        { id: '2', name: 'Mesero 1', role: 'waiter', pin: '0000', color: 'bg-orange-500' },
      ],
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),
      
      addUser: (user) => set((state) => ({ 
        users: [...state.users, { ...user, id: Date.now().toString() }] 
      })),
      
      updateUser: (id, updatedUser) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updatedUser } : u)
      })),
      
      removeUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),
    }),
    {
      name: 'el-otro-rollo-users',
    }
  )
);
