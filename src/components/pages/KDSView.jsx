import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../atoms/Card";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import ScrollArea from "../atoms/ScrollArea";
import { useKDSStore } from '../../store/useKDSStore';
import { 
  Clock, CheckCircle2, Flame, BellRing, CheckCheck, 
  UserCircle, Timer, AlertCircle, Zap
} from "lucide-react";
import { cn } from "../../lib/utils";

// ── Componente de Cronómetro Interno ──────────────────────────
function OrderTimer({ timestamp, status }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status === 'entregado' || status === 'listo') return;
    
    const interval = setInterval(() => {
      const start = new Date(timestamp).getTime();
      const now = new Date().getTime();
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp, status]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  // Determinar color de urgencia
  let colorClass = "text-success";
  if (minutes >= 5 && minutes < 10) colorClass = "text-[#FFB74D]";
  if (minutes >= 10) colorClass = "text-danger animate-pulse";

  return (
    <div className={`flex items-center gap-1 font-black text-sm ${colorClass}`}>
      <Timer className="w-3.5 h-3.5" />
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default function KDSView() {
  const { orders, updateOrderStatus } = useKDSStore();

  // Ocultar las ordenes ya entregadas para no saturar la pantalla
  const activeOrders = [...orders]
    .filter(o => o.status !== "entregado")
    .reverse(); // Las más nuevas primero

  const getStatusMeta = (status) => {
    switch (status) {
      case "recibido": 
        return { label: "Recibido", color: "text-danger", bg: "bg-danger/10", icon: BellRing };
      case "en_preparacion": 
        return { label: "Preparando", color: "text-[#FFB74D]", bg: "bg-[#FFB74D]/10", icon: Flame };
      case "listo": 
        return { label: "Listo", color: "text-success", bg: "bg-success/10", icon: CheckCircle2 };
      default: 
        return { label: "Desconocido", color: "text-foreground-muted", bg: "bg-surface", icon: Clock };
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-700">
      {/* ── KDS Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-surface shadow-neu rounded-[24px] p-6 border border-white/5 gap-6">
        <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto scrollbar-none">
          <Badge className="bg-surface shadow-neu-inset text-danger px-6 py-3 border border-white/5 rounded-2xl gap-3 text-xs font-black whitespace-nowrap">
            <BellRing className="w-4 h-4" />
            Nuevas: {activeOrders.filter(o => o.status === "recibido").length}
          </Badge>
          <Badge className="bg-surface shadow-neu-inset text-warning px-6 py-3 border border-white/5 rounded-2xl gap-3 text-xs font-black whitespace-nowrap">
            <Flame className="w-4 h-4" />
            En Cocina: {activeOrders.filter(o => o.status === "en_preparacion").length}
          </Badge>
          <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
          <Badge className="bg-surface shadow-neu-inset text-success px-6 py-3 border border-white/5 rounded-2xl gap-3 text-xs font-black whitespace-nowrap">
            <CheckCheck className="w-4 h-4" />
            Terminadas: {orders.filter(o => o.status === "entregado").length}
          </Badge>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
           <div className="text-right">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Live KDS Control</p>
              <p className="text-sm font-black text-foreground-subtle opacity-60">Sincronizado</p>
           </div>
           <div className="h-14 w-14 rounded-[18px] bg-surface shadow-neu flex items-center justify-center text-primary border border-white/5 active-scale">
              <Clock className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* ── Orders Grid ────────────────────────────────────────────── */}
      <ScrollArea className="flex-1 -m-2 p-2">
        {activeOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-32 gap-8 opacity-40">
              <div className="bg-surface shadow-neu-inset p-12 rounded-[40px] border border-white/5 relative">
                <CheckCheck className="h-24 w-24 text-success" />
                <div className="absolute -top-3 -right-3 bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white shadow-neu-glow-primary border-4 border-surface animate-bounce">
                   <Zap className="w-5 h-5" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-foreground font-black text-3xl tracking-tighter mb-2 uppercase">¡Cocina Despejada!</h2>
                <p className="text-foreground-subtle text-base font-bold max-w-sm mx-auto leading-relaxed">No hay tickets pendientes en este momento.</p>
              </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activeOrders.map(order => {
              const meta = getStatusMeta(order.status);
              const Icon = meta.icon;

              return (
                <div key={order.id} className="flex flex-col bg-surface shadow-neu rounded-[28px] overflow-hidden border border-white/5 group hover-scale transition-all duration-500 animate-in zoom-in-95 duration-300">
                  {/* Ticket Header */}
                  <div className="p-6 border-b border-white/5 flex flex-col gap-4 bg-surface relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-surface-low rounded-b-full opacity-20" />
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-foreground tracking-tighter uppercase">TKT-{String(order.id).slice(-4)}</span>
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">MESA {order.table}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-foreground-subtle">
                           <UserCircle className="w-3.5 h-3.5" />
                           <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Mesero: <span className="text-foreground">{order.waiter || 'POS'}</span></span>
                        </div>
                      </div>
                      <OrderTimer timestamp={order.timestamp} status={order.status} />
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/5 shadow-neu-inset",
                      meta.bg
                    )}>
                      <Icon className={cn("w-4 h-4", meta.color)} />
                      <span className={cn("text-[11px] font-black uppercase tracking-[0.15em]", meta.color)}>{meta.label}</span>
                    </div>
                  </div>
                  
                  {/* Ticket Items */}
                  <div className="flex-1 p-6 space-y-4 bg-surface/30">
                    <div className="space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <div className="flex justify-between items-start group/item">
                            <div className="flex gap-4">
                              <span className="font-black text-primary text-sm flex-shrink-0 bg-surface shadow-neu w-8 h-8 rounded-[10px] flex items-center justify-center border border-white/5">{item.quantity}</span>
                              <div className="flex flex-col">
                                <span className="text-[15px] font-black text-foreground leading-tight tracking-tight">{item.name}</span>
                                {item.category && <span className="text-[9px] font-black text-foreground-subtle uppercase tracking-widest opacity-40">{item.category}</span>}
                              </div>
                            </div>
                          </div>
                          {item.notes && (
                            <div className="ml-12 p-3 rounded-xl bg-danger/10 border border-danger/20 flex items-start gap-3 shadow-neu-sm">
                               <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                               <p className="text-[12px] text-danger font-black leading-tight tracking-tight">{item.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ticket Footer / Actions */}
                  <div className="p-6 bg-surface/50 border-t border-white/5">
                    {order.status === "recibido" && (
                      <button 
                        className="w-full h-14 flex items-center justify-center gap-3 bg-white/5 text-warning font-black text-[12px] uppercase tracking-widest rounded-2xl shadow-neu border border-white/5 hover:bg-warning/10 transition-all active-scale"
                        onClick={() => updateOrderStatus(order.id, "en_preparacion")}
                      >
                        <Flame className="w-4 h-4" />
                        A Fuego Lento
                      </button>
                    )}
                    {order.status === "en_preparacion" && (
                      <button 
                        className="w-full h-14 flex items-center justify-center gap-3 bg-success text-success-foreground font-black text-[12px] uppercase tracking-widest rounded-2xl shadow-neu-glow-success active-scale transition-all hover:opacity-90"
                        onClick={() => updateOrderStatus(order.id, "listo")}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        ¡Plato Listo!
                      </button>
                    )}
                    {order.status === "listo" && (
                      <button 
                        className="w-full h-14 flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black text-[12px] uppercase tracking-widest rounded-2xl shadow-neu-glow-primary active-scale transition-all hover:opacity-90"
                        onClick={() => updateOrderStatus(order.id, "entregado")}
                      >
                        <CheckCheck className="h-5 w-5" />
                        Pedido Entregado
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
