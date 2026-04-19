import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useValidationStore = create()(
  persist(
    (set, get) => ({
      validations: [],
      
      generateValidation: (serviceData) => {
        const newToken = {
          id: Math.random().toString(36).substr(2, 9).toUpperCase(),
          serviceName: serviceData.name,
          guestName: serviceData.guestName || 'Cliente General',
          cabinNumber: serviceData.cabinNumber || 'N/A',
          date: new Date().toISOString(),
          status: 'pending', // pending, used
          usedAt: null
        };
        
        set((state) => ({ 
          validations: [...state.validations, newToken] 
        }));
        
        return newToken;
      },
      
      validateToken: (tokenId) => {
        const state = get();
        const token = state.validations.find(v => v.id === tokenId);
        
        if (!token) return { success: false, message: "Código no encontrado" };
        if (token.status === 'used') return { success: false, message: `Ya fue utilizado el ${new Date(token.usedAt).toLocaleString()}` };
        
        set((state) => ({
          validations: state.validations.map(v => 
            v.id === tokenId ? { ...v, status: 'used', usedAt: new Date().toISOString() } : v
          )
        }));
        
        return { success: true, message: "Servicio validado correctamente", data: token };
      },

      clearUsed: () => set((state) => ({
        validations: state.validations.filter(v => v.status === 'pending')
      }))
    }),
    { name: 'el-otro-rollo-validations' }
  )
);
