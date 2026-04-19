import React, { useState } from "react";
import Badge from "../atoms/Badge";
import ScrollArea from "../atoms/ScrollArea";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import { useInventoryStore } from '../../store/useInventoryStore';
import { usePOSStore } from '../../store/usePOSStore';
import { useKDSStore } from '../../store/useKDSStore';
import { useUIStore } from '../../store/useUIStore';
import { useSalesStore } from '../../store/useSalesStore';
import { useConfigStore } from '../../store/useConfigStore';
import { useUserStore } from '../../store/useUserStore';
import { useCabinStore } from '../../store/useCabinStore';
import { useValidationStore } from '../../store/useValidationStore';
import { printTicket } from '../../utils/printTicket';
import { cn } from "../../lib/utils";
import {
  Search, Plus, Minus, Trash2, CreditCard, Banknote,
  ClipboardList, Utensils, ShoppingBag, Coffee, Package,
  Star, Zap, CheckCircle2, AlertCircle, Printer, UserCircle,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Icono por categoría ────────────────────────────────────────
const CATEGORY_ICONS = {
  Cocina:    { icon: Utensils,    color: 'text-[#FF7043]', bg: 'bg-[#FF7043]/10' },
  Tienda:    { icon: ShoppingBag, color: 'text-[#42A5F5]', bg: 'bg-[#42A5F5]/10' },
  Bebidas:   { icon: Coffee,      color: 'text-[#26A69A]', bg: 'bg-[#26A69A]/10' },
  Servicios: { icon: Star,        color: 'text-[#AB47BC]', bg: 'bg-[#AB47BC]/10' },
  Productos: { icon: Package,     color: 'text-[#66BB6A]', bg: 'bg-[#66BB6A]/10' },
  default:   { icon: Package,     color: 'text-foreground-muted', bg: 'bg-surface-lowest' },
};

const getCategoryMeta = (category) => CATEGORY_ICONS[category] || CATEGORY_ICONS.default;

// ── Componente de tarjeta de Producto ─────────────────────────
function ProductCard({ product, onAdd }) {
  const meta = getCategoryMeta(product.category);
  const Icon = meta.icon;

  return (
    <button
      onClick={() => onAdd(product)}
      className="bg-surface shadow-neu rounded-[24px] p-4 flex flex-col items-center gap-2 active-scale group hover-scale w-full border border-white/5 transition-all duration-300"
    >
      {/* Imagen / Icono en cavidad */}
      <div className={`w-full aspect-square rounded-[18px] flex items-center justify-center mb-1 overflow-hidden shadow-neu-inset bg-surface border border-white/10 group-hover:shadow-neu transition-all duration-500`}>
        {product.image
          ? <img src={product.image} alt={product.name} className="w-14 h-14 object-contain group-hover:scale-110 transition-all duration-500" referrerPolicy="no-referrer" />
          : <Icon className={`w-10 h-10 group-hover:scale-110 transition-all duration-500 ${meta.color}`} strokeWidth={1.5} />
        }
      </div>

      {/* Nombre del producto — fuerte */}
      <div className="w-full">
        <p className="text-[13px] font-black truncate w-full text-center leading-tight text-foreground px-1">
          {product.name}
        </p>
        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-foreground-subtle text-center mt-0.5 opacity-60">
          {product.category}
        </p>
      </div>

      {/* Precio — lila en cápsula levantada */}
      <span className="text-primary bg-surface shadow-neu font-black text-[0.85rem] px-5 py-2 rounded-xl mt-1 group-hover:shadow-neu-glow transition-all">
        ${product.price}
      </span>
    </button>
  );
}

// ── Componente principal ────────────────────────────────────────
export default function POSView() {
  const { products, categories } = useInventoryStore();
  const { cart, addToCart, removeFromCart, updateQty, getCalculations, clearCart } = usePOSStore();
  const { users, currentUser, setCurrentUser } = useUserStore();
  const { addOrder } = useKDSStore();
  const { addSale } = useSalesStore();
  const { config } = useConfigStore();
  const { cabins, addCharge } = useCabinStore();
  const addToast = useUIStore(state => state.addToast);
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  
  // Estados para el Modal de Pago
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [lastSaleData, setLastSaleData] = useState(null);
  const [selectedCabinId, setSelectedCabinId] = useState("");

  const { subtotal, tax, total } = getCalculations();

  const change = amountReceived ? Math.max(0, parseFloat(amountReceived) - total) : 0;
  const isEnough = amountReceived ? parseFloat(amountReceived) >= total : false;

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === "Todos" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Popular suggestions for empty cart
  const popular = products.slice(0, 3);

  // Iniciar proceso de pago (abre modal)
  const handleStartPayment = (method = 'cash') => {
    if (cart.length === 0) return;
    setSelectedMethod(method);
    setAmountReceived(method === 'card' || method === 'room_charge' ? total.toString() : "");
    setSelectedCabinId("");
    setShowSuccessState(false);
    setIsPaymentModalOpen(true);
  }

  // Finalizar venta (llamado desde el modal)
    const { generateValidation } = useValidationStore.getState();
    const serviceValidations = [];

    // Generar validaciones para servicios
    cart.forEach(item => {
      if (item.category === 'Servicios') {
        // Generar un ticket por cada unidad vendida si es necesario
        for(let i = 0; i < item.qty; i++) {
          const v = generateValidation({
            name: item.name,
            guestName: selectedMethod === 'room_charge' ? cabins.find(c => c.id === selectedCabinId)?.currentGuest : 'Cliente General',
            cabinNumber: selectedMethod === 'room_charge' ? cabins.find(c => c.id === selectedCabinId)?.number : 'N/A'
          });
          serviceValidations.push(v);
        }
      }
    });

    const saleData = {
      cart: [...cart],
      subtotal,
      tax,
      total,
      method: selectedMethod,
      received: parseFloat(amountReceived) || total,
      change: change,
      date: new Date().toISOString(),
      waiter: currentUser.name,
      validations: serviceValidations
    };

    // 1. Enviar a Cocina
    addOrder(cart, 'Mesa / Llevar', currentUser.name);
    
    // 2. Registrar Venta
    addSale({
       type: 'order',
       concept: `Venta - ${currentUser.name}`,
       ...saleData
    });

    // 3. Registrar Cargo a Cabaña si aplica
    if (selectedMethod === 'room_charge' && selectedCabinId) {
      addCharge(selectedCabinId, {
        concept: `Consumo POS - ${currentUser.name}`,
        total: total,
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        validations: serviceValidations // También guardamos los tokens en la cabaña
      });
    }
    
    // 4. Preparar para ticket
    setLastSaleData(saleData);
    setShowSuccessState(true);

    // 5. Limpiar carrito (pero mantenemos datos en saleData para el modal)
    clearCart();
    addToast(`Venta completada por ${currentUser.name}`, 'success');
  }

  const handlePrint = () => {
    if (lastSaleData) {
      printTicket(lastSaleData, config);
    }
  }

   const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setShowSuccessState(false);
    setAmountReceived("");
    setLastSaleData(null);
    setSelectedCabinId("");
  }

  const addToCartWithAnimation = (product) => {
    addToCart(product);
    addToast(`${product.name} agregado`, 'success');
  }

  return (
    <div className="bg-surface grid grid-cols-1 lg:grid-cols-3 gap-6 h-full text-foreground border-none">

      {/* ── COLUMNA: Productos ─────────────────────────────── */}
      <div className="lg:col-span-2 flex flex-col gap-5 min-h-0 bg-surface">

        {/* Header con Buscador y Selector de Usuario */}
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="Buscar por nombre o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-sm font-bold outline-none ring-primary/20 placeholder:text-foreground-subtle/50 h-16 bg-surface text-foreground shadow-neu-inset rounded-[18px] border border-white/5 focus:ring-4 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 bg-surface shadow-neu rounded-[18px] px-5 h-16 min-w-[240px] border border-white/5 hover-scale transition-all">
            <div className="p-2 rounded-xl bg-primary/10">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Personal</p>
              <select 
                value={currentUser?.id || ''} 
                onChange={(e) => {
                  const user = users.find(u => u.id === e.target.value);
                  setCurrentUser(user);
                }}
                className="bg-transparent border-none text-[13px] font-black outline-none w-full cursor-pointer text-foreground -mt-1 p-0"
              >
                <option value="" disabled>Seleccionar Mesero</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none pt-2">
          {(categories || ["Todos","Cocina","Tienda","Servicios","Productos"]).map(cat => {
            const isActive = cat === activeCategory;
            const meta = getCategoryMeta(cat);
            const Icon = meta.icon;
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3 whitespace-nowrap transition-all duration-300 flex-shrink-0 font-black text-[11px] uppercase tracking-wider rounded-[18px] border border-white/5 active-scale",
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-neu-glow' 
                    : 'bg-surface text-foreground-muted shadow-neu hover:text-foreground hover-scale'
                )}
              >
                {cat !== "Todos" && <Icon size={14} className={isActive ? 'text-primary-foreground' : meta.color} />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <ScrollArea className="flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="bg-surface shadow-neu-inset p-8 rounded-[32px] border border-white/5">
                <Search className="h-12 w-12 opacity-40 text-primary" />
              </div>
              <p className="text-sm font-black text-foreground-muted">Sin coincidencias para "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4 pr-1">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAdd={addToCartWithAnimation} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── COLUMNA: Carrito ───────────────────────────────── */}
      <div className="bg-surface shadow-neu rounded-[32px] flex flex-col h-full overflow-hidden border border-white/5">
        {/* Header */}
        <div className="bg-surface px-6 py-5 flex items-center justify-between z-10 border-b border-white/5 shadow-sm">
          <div>
            <h3 className="text-base font-black text-foreground tracking-tight">Pedido Actual</h3>
            <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest opacity-60">Resumen de cuenta</p>
          </div>
          <span className={cn(
            "text-[10px] font-black px-4 py-1.5 rounded-full transition-all duration-300",
            cart.length > 0 ? 'bg-primary text-primary-foreground shadow-neu-glow scale-110' : 'bg-surface-low text-foreground-subtle shadow-neu-inset opacity-50'
          )}>
            {cart.length} ÍTEMS
          </span>
        </div>

        {/* Items o empty state */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-12 px-2">
              <div className="bg-surface shadow-neu-inset p-10 rounded-[32px] border border-white/5">
                <ClipboardList className="h-12 w-12 opacity-30 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-black text-foreground">Carrito Vacío</p>
                <p className="text-[11px] font-bold text-foreground-subtle max-w-[180px] mx-auto mt-1 leading-relaxed">Comienza agregando productos del menú</p>
              </div>

              {/* Sugerencias rápidas */}
              <div className="w-full mt-4 space-y-4">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] mb-4 text-primary opacity-80 pl-2 text-center">⚡ Populares</p>
                <div className="flex flex-col gap-4">
                  {products.slice(0, 2).map(p => {
                    const meta = getCategoryMeta(p.category);
                    const Icon = meta.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => addToCartWithAnimation(p)}
                        className="bg-surface shadow-neu flex items-center gap-4 p-4 rounded-[24px] active-scale transition-all hover-scale text-left border border-white/5 min-h-[90px] group"
                      >
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-surface shadow-neu-inset-sm overflow-hidden border border-white/5`}>
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          ) : (
                            <Icon className={`h-8 w-8 ${meta.color} transition-transform group-hover:scale-110`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-black truncate text-foreground leading-tight">{p.name}</p>
                          <p className="text-sm font-black text-primary mt-1 tracking-tight">${p.price}</p>
                        </div>
                        <div className="bg-primary/5 p-2 rounded-xl text-primary transition-colors group-hover:bg-primary group-hover:text-white group-hover:shadow-neu-glow">
                          <Plus className="h-4 w-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {cart.map(item => {
                  const meta = getCategoryMeta(item.category);
                  const Icon = meta.icon;
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id} 
                      className="bg-surface shadow-neu flex gap-3 items-center p-3 rounded-[24px] border border-white/5"
                    >
                      {/* Thumbnail */}
                      <div className="h-14 w-14 rounded-[18px] flex items-center justify-center flex-shrink-0 bg-surface shadow-neu-inset-sm overflow-hidden border border-white/5">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Icon className={`h-7 w-7 ${meta.color}`} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-black truncate text-foreground leading-tight">{item.name}</p>
                        <p className="text-[11px] font-black text-primary mt-0.5">${item.price}/u</p>
                      </div>

                      {/* Qty stepper */}
                      <div className="shadow-neu-inset-sm bg-surface flex items-center rounded-xl overflow-hidden border border-white/5">
                        <button onClick={() => updateQty(item.id, -1)} className="px-2.5 py-2 hover:text-danger transition-colors text-foreground-muted bg-transparent active-scale">
                          <Minus className="h-3 w-3" strokeWidth={3} />
                        </button>
                        <span className="text-[11px] font-black w-5 text-center text-foreground">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-2.5 py-2 hover:text-primary transition-colors text-foreground-muted bg-transparent active-scale">
                          <Plus className="h-3 w-3" strokeWidth={3} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-surface shadow-neu text-danger p-2.5 rounded-xl hover:shadow-none active-scale transition-all border border-white/5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* TOTALES + PAGO */}
        <div className="bg-surface px-6 pt-6 pb-8 border-t border-white/5 space-y-6">

          {/* Totals section — inset cavity */}
          <div className="bg-surface shadow-neu-inset rounded-[24px] px-6 py-5 space-y-3 border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Subtotal</span>
              <span className="text-sm font-black text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">IVA (16%)</span>
              <span className="text-sm font-black text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/10 w-full my-1"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-foreground">Total</span>
              <span className="text-2xl font-black text-primary tracking-tighter">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
             <button
              onClick={() => handleStartPayment('cash')}
              disabled={cart.length === 0}
              className="w-full bg-primary shadow-neu-glow text-primary-foreground py-4 text-[13px] font-black tracking-[0.05em] uppercase active-scale transition-all hover:opacity-90 flex items-center justify-center gap-3 rounded-[20px] disabled:opacity-40"
            >
              <Zap className="h-5 w-5 fill-current" />
              Finalizar Pedido
            </button>
            <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleStartPayment('cash')}
                  disabled={cart.length === 0}
                  className="bg-surface shadow-neu text-foreground p-3 text-[11px] font-black uppercase tracking-widest active-scale transition-all hover-scale rounded-[18px] disabled:opacity-40 border border-white/5 flex items-center justify-center gap-2"
                >
                  <Banknote className="h-4 w-4 text-primary" />
                  Efectivo
                </button>
                <button 
                  onClick={() => handleStartPayment('card')}
                  disabled={cart.length === 0}
                  className="bg-surface shadow-neu text-foreground p-3 text-[11px] font-black uppercase tracking-widest active-scale transition-all hover-scale rounded-[18px] disabled:opacity-40 border border-white/5 flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4 text-primary" />
                  Tarjeta
                </button>
                <button 
                  onClick={() => handleStartPayment('room_charge')}
                  disabled={cart.length === 0}
                  className="bg-surface shadow-neu text-foreground p-3 text-[11px] font-black uppercase tracking-widest active-scale transition-all hover-scale rounded-[18px] disabled:opacity-40 border border-white/5 flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4 text-primary" />
                  Cargo Hab.
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL DE PAGO ─────────────────────────────────── */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={closePaymentModal}
        title={showSuccessState ? "" : "Procesar Pago"}
        className="max-w-md rounded-[32px] p-0 overflow-hidden"
      >
        <div className="p-8 space-y-8">
          {!showSuccessState ? (
            <>
              {/* Resumen de Monto */}
              <div className="text-center p-8 bg-surface shadow-neu-inset rounded-[28px] border border-white/5">
                <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2 opacity-60">Total a Pagar</p>
                <p className="text-5xl font-black text-primary tracking-tight">${total.toFixed(2)}</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {selectedMethod === 'cash' ? (
                    <Badge variant="warning" className="px-4 py-1.5 rounded-full font-black text-[10px] uppercase">Efectivo</Badge>
                  ) : (
                    <Badge variant="primary" className="px-4 py-1.5 rounded-full font-black text-[10px] uppercase">Tarjeta</Badge>
                  )}
                </div>
              </div>

              {/* Input de Efectivo Recibido */}
              {selectedMethod === 'cash' ? (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-subtle ml-2 opacity-60">Efectivo Recibido</label>
                  <div className="relative group">
                    <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-6 h-6 transition-transform group-focus-within:scale-110" />
                    <input 
                      type="number" 
                      autoFocus
                      placeholder="0.00"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="w-full pl-14 pr-6 py-6 text-3xl font-black bg-surface shadow-neu-inset rounded-[24px] outline-none focus:ring-8 focus:ring-primary/5 border border-white/5 text-foreground transition-all"
                    />
                  </div>

                  {/* Cambio a entregar */}
                  <AnimatePresence>
                    {amountReceived && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-6 rounded-[24px] flex justify-between items-center shadow-neu border border-white/5 ${isEnough ? 'bg-success/5 text-success' : 'bg-danger/5 text-danger'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isEnough ? 'bg-success/20' : 'bg-danger/20'}`}>
                            {isEnough ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest">{isEnough ? 'Cambio' : 'Faltante'}</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight">${Math.abs(change).toFixed(2)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : selectedMethod === 'room_charge' ? (
                <div className="space-y-6">
                   <div className="p-10 flex flex-col items-center justify-center gap-4 text-center bg-surface shadow-neu-inset rounded-[28px] border border-white/5">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-neu">
                      <Home className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-black text-foreground">Cargo a Habitación</p>
                      <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest opacity-60">Selecciona la cabaña ocupada</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-subtle ml-2 opacity-60">Cabañas Ocupadas</label>
                    <div className="bg-surface shadow-neu-inset rounded-[24px] p-2 border border-white/5">
                      <select 
                        value={selectedCabinId}
                        onChange={(e) => setSelectedCabinId(e.target.value)}
                        className="w-full bg-transparent p-4 text-sm font-black outline-none cursor-pointer text-foreground"
                      >
                        <option value="" disabled>Seleccionar Cabaña...</option>
                        {cabins.filter(c => c.status === 'occupied').map(c => (
                          <option key={c.id} value={c.id}>
                            Cabaña {c.number} - {c.currentGuest}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center gap-6 text-center bg-surface shadow-neu-inset rounded-[28px] border border-white/5">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-neu">
                    <CreditCard className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-black text-foreground">Procesar Tarjeta</p>
                    <p className="text-xs font-bold text-foreground-subtle leading-relaxed px-4 opacity-70">
                      Usa la terminal externa. Confirmar al recibir la aprobación bancaria por <span className="font-black text-foreground">${total.toFixed(2)}</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer del Modal (Procesando) */}
              <div className="flex flex-col gap-4">
                <button 
                  className={cn(
                    "w-full h-18 text-sm font-black uppercase tracking-widest py-5 rounded-[22px] transition-all active-scale shadow-neu-glow",
                    isEnough || selectedMethod === 'card' ? 'bg-success text-success-foreground' : 'bg-surface text-foreground-subtle opacity-50 cursor-not-allowed border border-white/5'
                  )}
                  onClick={() => {
                    const canFinalize = 
                      (selectedMethod === 'cash' && isEnough) || 
                      (selectedMethod === 'card') || 
                      (selectedMethod === 'room_charge' && selectedCabinId);
                    
                    if (canFinalize) handleFinalizeSale();
                  }}
                >
                  {selectedMethod === 'cash' ? 'Finalizar Venta' : selectedMethod === 'room_charge' ? 'Registrar Cargo' : 'Confirmar Cobro'}
                </button>
                <button 
                  onClick={closePaymentModal}
                  className="text-[10px] font-black text-foreground-subtle hover:text-danger uppercase tracking-[0.2em] transition-colors py-2 opacity-50 flex items-center justify-center gap-2 group"
                >
                  <Trash2 className="w-3 h-3 group-hover:shake" />
                  Cancelar y Salir
                </button>
              </div>
            </>
          ) : (
            <>
              {/* VISTA DE ÉXITO */}
              <div className="flex flex-col items-center py-10 gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-success/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                    <div className="relative w-28 h-28 rounded-full bg-success shadow-neu-glow-success flex items-center justify-center text-success-foreground">
                        <CheckCircle2 className="w-16 h-16" strokeWidth={3} />
                    </div>
                </div>
                
                <div className="text-center space-y-2">
                    <p className="text-2xl font-black text-foreground tracking-tight">¡Pago Exitoso!</p>
                    <p className="text-sm font-bold text-foreground-subtle opacity-70">Venta registrada y orden enviada.</p>
                </div>

                {selectedMethod === 'cash' && lastSaleData && (
                  <div className="w-full bg-surface shadow-neu-inset p-8 rounded-[28px] border border-white/5 flex flex-col items-center">
                    <p className="text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2 opacity-60">Entregar Cambio</p>
                    <p className="text-4xl font-black text-success tracking-tight">${lastSaleData.change.toFixed(2)}</p>
                  </div>
                )}

                <div className="flex flex-col w-full gap-4">
                   <button 
                     className="w-full bg-primary shadow-neu-glow text-primary-foreground py-5 rounded-[22px] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 active-scale"
                     onClick={handlePrint}
                    >
                     <Printer className="h-5 w-5" />
                     Imprimir Ticket
                   </button>
                   <button 
                     className="w-full bg-surface shadow-neu text-foreground py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active-scale border border-white/5"
                     onClick={closePaymentModal}
                    >
                     Nueva Orden
                   </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
