import React, { useState } from "react";
import { useGuestStore } from "../../store/useGuestStore";
import { useUIStore } from "../../store/useUIStore";
import { useSalesStore } from "../../store/useSalesStore";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import ScrollArea from "../atoms/ScrollArea";
import Input from "../atoms/Input";
import Modal from "../atoms/Modal";
import { Search, Plus, UserPlus, CreditCard, Clock, Key, Receipt } from "lucide-react";

export default function GuestsView() {
  const { guests, addGuest, checkoutGuest, addChargeToTab } = useGuestStore();
  const { addSale } = useSalesStore();
  const addToast = useUIStore(state => state.addToast);
  const [search, setSearch] = useState("");

  // Modal States
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [chargeModalData, setChargeModalData] = useState(null); // { id: guestId, name: guestName }
  const [checkoutModalData, setCheckoutModalData] = useState(null); // { id, name, tabAmount }

  // Form States
  const [newGuestForm, setNewGuestForm] = useState({ name: '', wristband: '', adults: 1, children: 0 });
  const [chargeAmount, setChargeAmount] = useState("");

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.wristband.toLowerCase().includes(search.toLowerCase())
  );

  const activeGuests = filteredGuests.filter(g => g.status === 'active');
  const pastGuests = filteredGuests.filter(g => g.status !== 'active');

  const getStatusBadge = (status) => {
    if (status === 'active') return <Badge className="bg-success text-success-foreground shadow-neu-glow-success border-none">En Sitio</Badge>;
    return <Badge className="bg-surface shadow-neu-inset text-foreground-muted border-none">Checkout</Badge>;
  };

  // Handlers
  const handleAddGuest = (e) => {
    e.preventDefault();
    if(!newGuestForm.name || !newGuestForm.wristband) return addToast('Faltan datos requeridos', 'error');
    addGuest(newGuestForm);
    setIsNewModalOpen(false);
    setNewGuestForm({ name: '', wristband: '', adults: 1, children: 0 });
    addToast('Huésped registrado correctamente', 'success');
  };

  const handleAddCharge = (e) => {
    e.preventDefault();
    const amount = parseFloat(chargeAmount);
    if(isNaN(amount) || amount <= 0) return addToast('El monto no es válido', 'error');
    addChargeToTab(chargeModalData.id, amount);
    setChargeModalData(null);
    setChargeAmount("");
    addToast('Cargo añadido correctamente', 'success');
  };

  const handleCheckout = () => {
    checkoutGuest(checkoutModalData.id);
    addSale({
       type: 'checkout',
       concept: `Checkout Huésped: ${checkoutModalData.name}`,
       amount: checkoutModalData.tabAmount,
       method: 'card' // Default to card for mockup
    });
    addToast(`Pago completado y Checkout realizado para ${checkoutModalData.name}`, 'success');
    setCheckoutModalData(null);
  };
  return (
    <div className="h-full flex flex-col gap-10 bg-surface relative animate-in fade-in duration-700">
      {/* ── Control Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full max-w-lg group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-subtle transition-colors group-focus-within:text-primary" />
          <input 
            placeholder="Buscar por nombre o número de pulsera..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface shadow-neu-inset rounded-[24px] pl-14 pr-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <button 
          onClick={() => setIsNewModalOpen(true)} 
          className="h-14 px-10 flex items-center gap-3 bg-primary text-primary-foreground font-black text-[12px] uppercase tracking-[0.2em] shadow-neu-glow-primary rounded-[22px] active-scale transition-all hover:opacity-95"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Huésped
        </button>
      </div>

      {/* ── Analytical Matrix ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Key className="h-16 w-16 text-primary" />
            </div>
            <p className="text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2 opacity-60">Cuentas Activas</p>
            <div className="text-4xl font-black text-foreground tracking-tighter">{activeGuests.length}</div>
            <div className="mt-4 flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">En Operación</span>
            </div>
         </div>

         <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <CreditCard className="h-16 w-16 text-success" />
            </div>
            <p className="text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2 opacity-60">Balance Pendiente</p>
            <div className="text-4xl font-black text-success tracking-tighter">
               ${activeGuests.reduce((acc, g) => acc + g.tabAmount, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-4 text-[10px] font-black text-success uppercase tracking-widest opacity-60">Flujo Garantizado</div>
         </div>

         <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Receipt className="h-16 w-16 text-foreground-subtle" />
            </div>
            <p className="text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2 opacity-60">Checkout (Hoy)</p>
            <div className="text-4xl font-black text-foreground tracking-tighter">{pastGuests.length}</div>
            <div className="mt-4 text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Transacciones Cerradas</div>
         </div>
      </div>

      {/* ── Data Hub ────────────────────────────────────────────────── */}
      <div className="bg-surface shadow-neu rounded-[36px] border border-white/5 overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <ScrollArea className="flex-1 scrollbar-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
                <th className="px-10 py-8 text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] opacity-40">Identidad / Grupo</th>
                <th className="px-8 py-8 text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] opacity-40 text-center whitespace-nowrap">ID Pulsera</th>
                <th className="px-8 py-8 text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] opacity-40 text-center">Cuórum</th>
                <th className="px-8 py-8 text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] opacity-40 text-center">Consumo Acum.</th>
                <th className="px-8 py-8 text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] opacity-40 text-center">Estado</th>
                <th className="px-10 py-8 text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] opacity-40 text-right">Comandos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredGuests.map(guest => (
                <tr key={guest.id} className="group hover:bg-white/[0.02] transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                       <div className="h-14 w-14 rounded-2xl bg-primary shadow-neu-glow-primary flex items-center justify-center font-black text-sm text-primary-foreground border border-white/20 select-none">
                          {guest.name.substring(0,2).toUpperCase()}
                       </div>
                       <div>
                          <p className="text-[15px] font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{guest.name}</p>
                          <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-40 mt-1">Ingreso: {new Date(guest.checkIn).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-4 py-2 rounded-xl bg-surface shadow-neu-inset text-primary font-black text-[11px] uppercase tracking-[0.15em] border border-white/5">
                       {guest.wristband}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-sm font-black text-foreground tracking-tighter">{guest.adults + guest.children}</span>
                       <span className="text-[9px] font-black text-foreground-subtle uppercase tracking-widest opacity-40">{guest.adults}A | {guest.children}N</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-black text-base text-foreground tracking-tighter">
                    ${guest.tabAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-center">
                    {guest.status === 'active' ? (
                       <span className="px-4 py-2 rounded-xl bg-success/10 text-success text-[10px] font-black uppercase tracking-widest border border-success/20">Activo</span>
                    ) : (
                       <span className="px-4 py-2 rounded-xl bg-surface shadow-neu-inset text-foreground-subtle text-[10px] font-black uppercase tracking-widest opacity-40">Cerrada</span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       {guest.status === 'active' && (
                         <>
                           <button 
                             onClick={() => setChargeModalData({id: guest.id, name: guest.name})}
                             className="h-11 w-11 flex items-center justify-center rounded-[14px] bg-surface shadow-neu text-primary border border-white/5 hover:bg-primary hover:text-primary-foreground transition-all active-scale"
                           >
                             <Plus className="w-5 h-5" />
                           </button>
                           <button 
                             onClick={() => setCheckoutModalData({id: guest.id, name: guest.name, tabAmount: guest.tabAmount})}
                             className="h-11 px-6 flex items-center gap-2 rounded-[14px] bg-surface shadow-neu text-danger font-black text-[11px] uppercase tracking-widest border border-white/5 hover:bg-danger hover:text-white transition-all active-scale"
                           >
                             Cierre
                           </button>
                         </>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGuests.length === 0 && (
                 <tr>
                    <td colSpan="6" className="text-center py-32">
                       <div className="flex flex-col items-center opacity-30">
                          <Search className="h-16 w-16 mb-4" />
                          <p className="text-lg font-black uppercase tracking-widest">Sin Coincidencias</p>
                       </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      {/* ── Flow Matrix Modals ────────────────────────────────────────── */}
      
      {/* Nuevo Registro */}
      <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title="Empadronamiento de Huésped">
        <form onSubmit={handleAddGuest} className="space-y-8 p-4">
          <div>
             <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">Identifiación Grupal / Titular</label>
             <input 
               required
               placeholder="P. ej. Familia García" 
               value={newGuestForm.name}
               onChange={e => setNewGuestForm({...newGuestForm, name: e.target.value})}
               className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all placeholder:opacity-30"
             />
          </div>
          <div>
             <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">ID Digital / Pulsera</label>
             <input 
               required
               placeholder="VIP-0000" 
               value={newGuestForm.wristband}
               onChange={e => setNewGuestForm({...newGuestForm, wristband: e.target.value})}
               className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all text-primary placeholder:opacity-30"
             />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
               <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">Adultos</label>
               <input 
                 type="number" min="1"
                 value={newGuestForm.adults}
                 onChange={e => setNewGuestForm({...newGuestForm, adults: parseInt(e.target.value) || 1 })}
                 className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
               />
            </div>
            <div>
               <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">Menores</label>
               <input 
                 type="number" min="0"
                 value={newGuestForm.children}
                 onChange={e => setNewGuestForm({...newGuestForm, children: parseInt(e.target.value) || 0 })}
                 className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
               />
            </div>
          </div>
          <button type="submit" className="w-full py-6 flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black text-[12px] uppercase tracking-[0.2em] shadow-neu-glow-primary rounded-[24px] active-scale transition-all hover:opacity-95">
             <UserPlus className="w-5 h-5" /> Registrar e Iniciar Estancia
          </button>
        </form>
      </Modal>

      {/* Cargo Extra */}
      <Modal isOpen={!!chargeModalData} onClose={() => setChargeModalData(null)} title="Inyección de Cargo Manual">
        {chargeModalData && (
          <form onSubmit={handleAddCharge} className="space-y-8 p-4">
            <div className="p-6 rounded-[24px] bg-surface shadow-neu-inset border border-white/5 text-center">
              <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.25em] mb-2 opacity-60 underline underline-offset-8 decoration-primary">Titular de Cuenta</p>
              <h4 className="text-xl font-black text-foreground tracking-tighter">{chargeModalData.name}</h4>
            </div>
            <div>
               <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">Monto del Servicio / Artículo ($)</label>
               <input 
                 type="number" step="0.01" min="0.01" required autoFocus
                 placeholder="0.00" 
                 value={chargeAmount}
                 onChange={e => setChargeAmount(e.target.value)}
                 className="w-full bg-surface shadow-neu-inset rounded-[20px] px-8 py-8 text-4xl font-black outline-none border border-white/5 focus:ring-4 focus:ring-success/10 transition-all text-center text-success"
               />
            </div>
            <button type="submit" className="w-full py-6 flex items-center justify-center gap-3 bg-success text-success-foreground font-black text-[12px] uppercase tracking-[0.2em] shadow-neu-glow-success rounded-[24px] active-scale transition-all hover:opacity-95">
               <Plus className="w-5 h-5" /> Confirmar Cargo
            </button>
          </form>
        )}
      </Modal>

      {/* Checkout Matrix */}
      <Modal isOpen={!!checkoutModalData} onClose={() => setCheckoutModalData(null)} title="Liquidación de Cuenta">
        {checkoutModalData && (
          <div className="space-y-10 p-4">
            <div className="bg-surface shadow-neu rounded-[32px] p-10 border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Receipt className="h-32 w-32" />
               </div>
               
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div>
                      <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.25em] mb-1 opacity-60">Cierre de Cuenta</p>
                      <h3 className="text-2xl font-black text-foreground tracking-tighter">{checkoutModalData.name}</h3>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.25em] mb-1 opacity-60">Consumo Total</p>
                       <p className="text-4xl font-black text-danger tracking-tighter">${checkoutModalData.tabAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-sm">
                       <span className="font-black text-foreground-subtle uppercase tracking-widest opacity-40">Concepto Global</span>
                       <span className="font-bold text-foreground">Consumos & Servicios Diversos</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="font-black text-foreground-subtle uppercase tracking-widest opacity-40">Tasa Aplicada</span>
                       <span className="font-bold text-foreground">8% IVA / Incluido</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleCheckout} 
                className="w-full py-7 flex items-center justify-center gap-4 bg-danger text-white font-black text-[13px] uppercase tracking-[0.25em] shadow-neu-glow-danger rounded-[28px] active-scale transition-all hover:opacity-95"
              >
                 <Receipt className="w-5 h-5" /> Proceder al Pago y Checkout
              </button>
              <button 
                onClick={() => setCheckoutModalData(null)} 
                className="w-full py-4 text-[10px] font-black text-foreground-subtle uppercase tracking-widest hover:text-foreground transition-all active-scale"
              >
                 Abortar Operación
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
