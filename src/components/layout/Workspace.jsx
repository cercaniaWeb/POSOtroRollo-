import React from 'react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { Search, Plus, Minus, Trash2, ShoppingBasket } from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';

const Workspace = ({ children }) => {
  const { cart, updateQty, removeFromCart, getCalculations } = usePOSStore();
  const { subtotal, itemsCount } = getCalculations();

  return (
    <div className="ml-24 min-h-screen bg-surface p-10 flex gap-10">
      {/* Main Content Area (Products) */}
      <div className="flex-1 space-y-10">
        <header className="flex justify-between items-center bg-surface-low p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-sidebar-navy">Terminal 01</h1>
            <p className="text-slate-brand font-medium">Sucursal El Otro Rollo</p>
          </div>
          <div className="flex gap-4">
             <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-brand" size={20} />
               <input 
                 type="text" 
                 placeholder="Buscar productos..."
                 className="bg-surface-lowest pl-12 pr-6 py-4 rounded-xl shadow-ambient focus:ring-2 focus:ring-primary-container outline-none border-none transition-all w-80 font-medium"
               />
             </div>
             <Button variant="secondary">Filtrar</Button>
          </div>
        </header>

        {/* Product Grid - Editorial Style */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {children}
        </div>
      </div>

      {/* Right Sidebar (Cart) */}
      <aside className="w-[450px] space-y-6">
        <Card className="h-[calc(100vh-80px)] sticky top-10 flex flex-col" padding="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Carrito</h2>
            <span className="bg-surface-low px-4 py-1 rounded-full text-primary font-bold text-sm">
              {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 -mx-2 px-2">
             {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-brand opacity-50 space-y-4">
                 <ShoppingBasket size={64} strokeWidth={1} />
                 <p className="font-medium">Tu carrito está vacío</p>
               </div>
             ) : (
               cart.map((item) => (
                 <div key={item.id} className="flex gap-4 p-4 hover:bg-surface-low rounded-xl transition-all duration-300 group">
                   <div className="w-16 h-16 bg-slate-brand/10 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">
                     {item.emoji || '📦'}
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-sidebar-navy truncate max-w-[180px]">{item.name}</h4>
                     <p className="text-slate-brand text-sm">${item.price.toLocaleString()} MXN</p>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                     <span className="font-extrabold text-sidebar-navy">${(item.price * item.qty).toLocaleString()}</span>
                     <div className="flex items-center gap-2 bg-surface-low rounded-lg p-1">
                       <button 
                         onClick={() => updateQty(item.id, -1)}
                         className="p-1 hover:text-primary transition-colors"
                       >
                         <Minus size={14} strokeWidth={3} />
                       </button>
                       <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                       <button 
                         onClick={() => updateQty(item.id, 1)}
                         className="p-1 hover:text-primary transition-colors"
                       >
                         <Plus size={14} strokeWidth={3} />
                       </button>
                       <button 
                         onClick={() => removeFromCart(item.id)}
                         className="p-1 text-slate-brand hover:text-red-500 transition-colors ml-1"
                       >
                         <Trash2 size={14} />
                       </button>
                     </div>
                   </div>
                 </div>
               ))
             )}
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col gap-4">
            <div className="flex justify-between text-slate-brand">
              <span>Subtotal (Neto)</span>
              <span className="font-bold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-2xl font-extrabold">
              <span>Total</span>
              <span className="text-primary-container">${(subtotal * 1.16).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
};

export default Workspace;
