import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_USERS = [
  { id: '1', name: 'Administrador', role: 'admin',    pin: '1234', color: 'bg-primary' },
  { id: '2', name: 'Encargado',     role: 'manager',  pin: '2222', color: 'bg-blue-500' },
  { id: '3', name: 'Cajera',        role: 'cashier',  pin: '3333', color: 'bg-green-500' },
  { id: '4', name: 'Vendedor',      role: 'seller',   pin: '4444', color: 'bg-orange-500' },
  { id: '5', name: 'Cocina',        role: 'kitchen',  pin: '5555', color: 'bg-red-500' },
];

export const useUserStore = create(
  persist(
    (set) => ({
      users: DEFAULT_USERS,
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      
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
      version: 2, // Bump version to trigger migration
      migrate: (persistedState, version) => {
        // Ensure all default roles exist; add any that are missing
        const existing = persistedState.users || [];
        const roles = existing.map(u => u.role);
        const missing = DEFAULT_USERS.filter(u => !roles.includes(u.role));
        return {
          ...persistedState,
          users: [...existing, ...missing],
          currentUser: null, // Always reset login on migration
        };
      },
    }
  )
);
