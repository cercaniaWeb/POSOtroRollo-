import React from "react";
import { usePOSStore } from "../../store/usePOSStore";
import { useInventoryStore } from "../../store/useInventoryStore";
import { 
  LayoutDashboard, 
  Utensils, 
  Users, 
  Package, 
  History, 
  QrCode, 
  Settings, 
  Palette,
  ClipboardList,
  ChevronRight,
  Zap,
  UserCircle,
  Home
} from "lucide-react";
import { cn } from "../../components/atoms/Button";
import Button from "../atoms/Button";
import ScrollArea from "../atoms/ScrollArea";
import ToastBox from "../atoms/ToastBox";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "dashboard", label: "Panel Principal", icon: LayoutDashboard },
  { id: "pos",       label: "Punto de Venta", icon: Utensils },
  { id: "kds",       label: "Cocina (KDS)",   icon: Zap },
  { id: "guests",    label: "Huéspedes",      icon: Users },
  { id: "cabins",    label: "Cabañas",        icon: Home },
  { id: "users",     label: "Personal",       icon: UserCircle },
  { id: "inventory", label: "Inventario",     icon: Package },
  { id: "sales",     label: "Historial",      icon: History },
  { id: "qr",        label: "Códigos QR",     icon: QrCode },
  { id: "config",    label: "Configuración",  icon: Settings },
];

export default function AppLayout({ children, currentView, onViewChange }) {
  const clearCart = usePOSStore(state => state.clearCart);
  const { products, lowStockThreshold } = useInventoryStore();

  const lowStockCount = products.filter(p => (p.stock || 0) <= lowStockThreshold && p.stock !== Infinity).length;

  const handleNewOrder = () => {
    clearCart();
    onViewChange('pos');
  };

  return (
    <div className="flex h-screen bg-surface text-foreground font-sans overflow-hidden selection:bg-primary/20 selection:text-primary">
      <ToastBox />

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-72 flex flex-col m-5 mr-0 rounded-[36px] shadow-neu bg-surface z-20 border border-white/5 overflow-hidden transition-all duration-500">
        {/* Logo Section */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-4 group">
            <div className="h-14 w-14 rounded-[20px] bg-surface flex items-center justify-center shadow-neu-inset overflow-hidden border border-white/10 group-hover:shadow-neu transition-all duration-500">
              <img src="/logo.png" alt="El Otro Rollo" className="h-4/5 w-4/5 object-contain opacity-90" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-foreground -mb-1 leading-none">EL OTRO ROLLO</h1>
              <p className="text-[10px] text-foreground-subtle uppercase font-black tracking-[0.25em] opacity-40">Premium POS</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <ScrollArea className="flex-1 px-4 py-4 scrollbar-none">
          <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.3em] px-6 mb-6 opacity-30 select-none">Consola de Control</p>
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const hasAlert = item.id === 'inventory' && lowStockCount > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4.5 rounded-[22px] text-[13px] font-black transition-all duration-400 relative group active-scale",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-neu-glow-primary translate-x-1"
                      : "text-foreground-muted hover:text-foreground hover:bg-white/[0.03] hover:shadow-neu-sm"
                  )}
                >
                  <div className="relative">
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-all duration-500",
                      isActive ? "text-primary-foreground scale-110" : "text-foreground-subtle group-hover:text-primary group-hover:scale-110"
                    )} />
                    {hasAlert && (
                      <span className="absolute -top-2.5 -right-2.5 h-5 w-5 bg-danger text-[10px] font-black text-white flex items-center justify-center rounded-full shadow-neu-glow-danger animate-pulse ring-4 ring-surface">
                        {lowStockCount}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-left tracking-tight uppercase text-[11px] tracking-[0.05em]">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="nav-indicator-bar" className="absolute right-3 w-1 h-5 bg-primary-foreground/30 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Operator Profile Card */}
        <div className="p-6 mt-auto">
          <div className="shadow-neu-inset rounded-[28px] p-4 flex items-center gap-4 bg-surface/50 border border-white/5 group hover:bg-surface transition-colors cursor-pointer active-scale">
            <div className="h-12 w-12 rounded-[18px] bg-primary flex items-center justify-center shadow-neu-glow-primary text-primary-foreground font-black text-sm flex-shrink-0 border border-white/20">
              LR
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-foreground truncate tracking-tight">Luis Romero</p>
              <div className="flex items-center gap-1.5 opacity-40">
                <div className="h-1.5 w-1.5 rounded-full bg-success" />
                <p className="text-[9px] text-foreground-subtle font-black uppercase tracking-widest">Master Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Canvas ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Premium Header */}
        <header className="h-24 flex items-center justify-between px-10 z-20 relative bg-surface/80 backdrop-blur-2xl m-5 mb-0 rounded-[32px] shadow-neu border border-white/5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
               <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-60">Operación Activa</p>
            </div>
            <h2 className="text-2xl font-black capitalize text-foreground tracking-tighter">
              {currentView.replace("-", " ")}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 bg-surface shadow-neu-inset px-5 py-2.5 rounded-[18px] border border-white/5">
               <Zap className="h-4 w-4 text-warning" />
               <span className="text-[11px] font-black text-foreground-subtle uppercase tracking-widest">Sistema Listado</span>
            </div>

            <div className="h-12 w-[1px] bg-white/5 mx-2" />

            <button 
              onClick={() => onViewChange('sales')}
              className="px-6 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] text-foreground-subtle hover:text-foreground bg-surface shadow-neu border border-white/5 transition-all flex items-center gap-3 active-scale"
            >
              <History className="h-4 w-4" />
              Auditoría
            </button>
            <button 
              onClick={handleNewOrder}
              className="h-14 px-8 bg-primary text-primary-foreground font-black text-[12px] uppercase tracking-[0.2em] shadow-neu-glow-primary rounded-[22px] active-scale transition-all hover:opacity-95 flex items-center gap-3"
            >
              <Utensils className="h-5 w-5" />
              Nueva Venta
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 overflow-auto p-8 relative scrollbar-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.99, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01, y: -20 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
