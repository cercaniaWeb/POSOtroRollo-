import { create } from 'zustand';

export const useUIStore = create((set) => ({
  toasts: [],
  
  addToast: (message, variant = 'success') => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant }]
    }));
    
    // Auto-remove with a smooth exit
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 3000);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  }))
}));
