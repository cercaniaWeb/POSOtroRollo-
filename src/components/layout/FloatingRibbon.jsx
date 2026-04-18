import React from 'react';
import Button from '../atoms/Button';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';
import { useUIStore } from '../../store/useUIStore';

const FloatingRibbon = () => {
  const { getCalculations, clearCart } = usePOSStore();
  const { addToast } = useUIStore();
  const { subtotal, tax, total, itemsCount } = getCalculations();

  const handlePayment = () => {
    if (itemsCount === 0) {
      addToast('El carrito está vacío', 'error');
      return;
    }
    
    // Simulate payment process
    addToast('Procesando pago Bancario...', 'success');
    setTimeout(() => {
      addToast('Venta finalizada con éxito', 'success');
      clearCart();
    }, 1500);
  };

  if (itemsCount === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-120px)] max-w-7xl z-40">
      <div className="glass-surface bg-white/40 shadow-ambient rounded-[32px] p-6 pr-8 flex justify-between items-center border border-white/20 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-sophisticated">
        <div className="flex gap-12 ml-6">
          <div className="flex flex-col">
            <span className="text-slate-brand text-xs font-bold uppercase tracking-widest mb-1">Base imponible</span>
            <span className="text-xl font-bold font-sans text-sidebar-navy">
              ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-brand text-xs font-bold uppercase tracking-widest mb-1">Impuestos (16%)</span>
            <span className="text-xl font-bold font-sans text-sidebar-navy">
              ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col border-l border-outline-variant pl-12">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Total a Pagar</span>
            <span className="text-3xl font-extrabold font-sans text-primary">
              ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Button 
            variant="ghost" 
            className="px-10"
            onClick={clearCart}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            className="px-12 py-5 text-lg flex gap-3 items-center"
            onClick={handlePayment}
          >
            <CreditCard size={24} />
            Pagar Ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingRibbon;
