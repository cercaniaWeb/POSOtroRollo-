import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default
      
      toggleTheme: () => set((state) => {
         const newTheme = state.theme === 'dark' ? 'light' : 'dark';
         // Side-effect: update DOM
         if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
         } else {
            document.documentElement.classList.remove('dark');
         }
         return { theme: newTheme };
      }),
      
      initTheme: () => {
         // Apply immediately on mount
         const current = get().theme;
         if (current === 'dark') {
            document.documentElement.classList.add('dark');
         } else {
            document.documentElement.classList.remove('dark');
         }
      }
    }),
    { name: 'fintech-theme-store' }
  )
);
