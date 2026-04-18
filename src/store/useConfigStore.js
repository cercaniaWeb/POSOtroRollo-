import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfigStore = create()(
  persist(
    (set) => ({
      config: {
        businessName: "El Otro Rollo",
        businessAddress: "Carretera Fed. Puebla-Tehuacán Km 28",
        businessPhone: "222 123 4567",
        businessEmail: "hola@elotrorollo.com",
        ticketHeader: "¡Bienvenidos al Paraíso!",
        ticketFooter: "Gracias por su visita. ¡Vuelva pronto!",
        currency: "MXN",
        taxRate: 16,
        showLogoInTicket: true
      },
      updateConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig }
      })),
    }),
    { name: 'fintech-config-store' }
  )
);
