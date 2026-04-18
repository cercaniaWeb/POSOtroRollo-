import React from "react";
import { useThemeStore } from "../../store/useThemeStore";
import { useUIStore } from "../../store/useUIStore";
import { useConfigStore } from "../../store/useConfigStore";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Settings, Moon, Sun, Printer, Wifi, UserCircle2, Save, Store, FileText, AlignLeft, AlignCenter } from "lucide-react";
import { cn } from "../../lib/utils";

export default function SettingsView() {
  const { theme, toggleTheme } = useThemeStore();
  const { config, updateConfig } = useConfigStore();
  const addToast = useUIStore(state => state.addToast);

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Configuraciones guardadas localmente', 'success');
  };

  const handleConfigChange = (field, value) => {
    updateConfig({ [field]: value });
  };

  return (
    <div className="h-full flex flex-col gap-8 bg-surface relative overflow-y-auto pb-20 scrollbar-none">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between sticky top-0 bg-surface/90 backdrop-blur-xl z-20 py-6 border-b border-white/5">
        <div className="flex items-center gap-5">
           <div className="h-14 w-14 rounded-[20px] bg-surface shadow-neu flex items-center justify-center text-primary border border-white/5">
              <Settings className="w-7 h-7" />
           </div>
           <div>
              <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">Panel de Configuración</h2>
              <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Control Maestro del Sistema POS</p>
           </div>
        </div>
        <button 
          onClick={handleSave} 
          className="h-14 px-8 flex items-center gap-3 bg-primary text-primary-foreground font-black text-[12px] uppercase tracking-widest shadow-neu-glow-primary rounded-[20px] active-scale transition-all hover:opacity-90"
        >
          <Save className="w-5 h-5" />
          Sincronizar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-10">
           {/* Modulo Negocio */}
           <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
                   <Store className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black text-foreground tracking-tight">Identidad del Establecimiento</h3>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-2 block opacity-60">Nombre Comercial</label>
                    <input 
                      value={config.businessName} 
                      onChange={e => handleConfigChange('businessName', e.target.value)} 
                      className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-2 block opacity-60">Dirección Operativa</label>
                    <input 
                      value={config.businessAddress} 
                      onChange={e => handleConfigChange('businessAddress', e.target.value)} 
                      className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-2 block opacity-60">Teléfono</label>
                       <input 
                         value={config.businessPhone} 
                         onChange={e => handleConfigChange('businessPhone', e.target.value)} 
                         className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-2 block opacity-60">Impuesto (%)</label>
                       <input 
                         type="number" 
                         value={config.taxRate} 
                         onChange={e => handleConfigChange('taxRate', parseFloat(e.target.value))} 
                         className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Modulo Personalización de Ticket */}
           <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
                   <FileText className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black text-foreground tracking-tight">Formato de Comprobante</h3>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-2 block opacity-60">Encabezado Digital</label>
                    <input 
                      value={config.ticketHeader} 
                      onChange={e => handleConfigChange('ticketHeader', e.target.value)} 
                      placeholder="Ej: ¡Bienvenidos!"
                      className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-2 block opacity-60">Pie de Página</label>
                    <textarea 
                      value={config.ticketFooter} 
                      onChange={e => handleConfigChange('ticketFooter', e.target.value)}
                      className="w-full bg-surface shadow-neu-inset rounded-[24px] px-6 py-5 text-sm font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px]"
                      placeholder="Ej: Gracias por su preferencia..."
                    />
                 </div>
                 <div className="flex items-center justify-between p-6 bg-surface shadow-neu-inset rounded-[24px] border border-white/5">
                    <div>
                       <span className="text-sm font-black text-foreground uppercase tracking-widest">Identidad Visual</span>
                       <p className="text-[10px] font-bold text-foreground-subtle opacity-60">Mostrar logo en tickets impresos/digitales</p>
                    </div>
                    <button 
                      onClick={() => handleConfigChange('showLogoInTicket', !config.showLogoInTicket)}
                      className={cn(
                        "w-14 h-8 rounded-full transition-all flex items-center px-1 border border-white/10",
                        config.showLogoInTicket ? 'bg-primary justify-end shadow-neu-glow' : 'bg-surface shadow-neu-inset justify-start'
                      )}
                    >
                      <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="flex flex-col gap-10">
           {/* Modulo de Tema */}
           <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-xl bg-warning/10 text-warning">
                   {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                 </div>
                 <h3 className="text-xl font-black text-foreground tracking-tight">Experiencia de Usuario</h3>
              </div>
              <div className="flex items-center justify-between bg-surface shadow-neu-inset p-6 rounded-[24px] border border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-[16px] bg-surface shadow-neu flex items-center justify-center text-warning border border-white/5">
                       {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                    </div>
                    <div>
                       <p className="text-foreground font-black uppercase tracking-widest text-sm">{theme === 'dark' ? 'Modo Nocturno' : 'Modo Diurno'}</p>
                       <p className="text-[10px] font-bold text-foreground-subtle opacity-60">Interfaz adaptada a la iluminación</p>
                    </div>
                 </div>
                 <button 
                   onClick={toggleTheme} 
                   className="h-12 px-6 bg-surface shadow-neu rounded-[16px] text-primary font-black text-[11px] uppercase tracking-widest border border-white/5 active-scale"
                 >
                    Alternar
                 </button>
              </div>
           </div>

           {/* Modulo Periféricos e Impresoras */}
           <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-xl bg-success/10 text-success">
                   <Printer className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black text-foreground tracking-tight">Hardware & Ecosistema</h3>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between bg-surface shadow-neu-inset p-6 rounded-[24px] border border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-[16px] bg-surface shadow-neu flex items-center justify-center text-success border border-white/5">
                          <Wifi className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-foreground font-black uppercase tracking-widest text-sm">Cajón Automático</p>
                          <p className="text-[10px] font-bold text-foreground-subtle opacity-60">Puerto: USB/RJ11 (Sincronizado)</p>
                       </div>
                    </div>
                    <button className="h-12 px-6 bg-surface shadow-neu rounded-[16px] text-primary font-black text-[11px] uppercase tracking-widest border border-white/5 active-scale group">
                       <span className="group-hover:text-primary transition-colors">Test</span>
                    </button>
                 </div>

                 <div className="flex items-center justify-between bg-surface shadow-neu-inset p-6 rounded-[24px] border border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-[16px] bg-surface shadow-neu flex items-center justify-center text-success border border-white/5">
                          <Printer className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-foreground font-black uppercase tracking-widest text-sm">Impresora Térmica</p>
                          <p className="text-[10px] font-bold text-foreground-subtle opacity-60">Estado: Activo (80mm)</p>
                       </div>
                    </div>
                    <button className="h-12 px-6 bg-surface shadow-neu rounded-[16px] text-primary font-black text-[11px] uppercase tracking-widest border border-white/5 active-scale group">
                       <span className="group-hover:text-primary transition-colors">Imprimir Prueba</span>
                    </button>
                 </div>
              </div>
           </div>

           {/* Modulo Operadores */}
           <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
                   <UserCircle2 className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black text-foreground tracking-tight">Staff Autorizado</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-surface shadow-neu-inset border border-white/5 p-5 rounded-[24px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[16px] bg-primary text-primary-foreground font-black flex items-center justify-center text-sm shadow-neu-glow-primary">LR</div>
                      <div>
                        <p className="font-black text-base text-foreground">Administrador Master</p>
                        <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Acceso Total</p>
                      </div>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-success shadow-neu-glow-success" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
