import React, { useState } from "react";
import { useSalesStore } from "../../store/useSalesStore";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import Badge from "../atoms/Badge";
import ScrollArea from "../atoms/ScrollArea";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Search, Banknote, CreditCard, Clock, CheckCircle2, TrendingUp, CalendarDays, DollarSign, Download } from "lucide-react";
import { exportToCSV } from "../../utils/exportUtils";
import { cn } from "../../lib/utils";

export default function SalesHistoryView() {
  const { sales, clearSales } = useSalesStore();
  const [search, setSearch] = useState("");

  const filteredSales = sales.filter(s => 
    s.concept.toLowerCase().includes(search.toLowerCase()) || 
    s.id.includes(search)
  );

  const totalSalesAmount = sales.reduce((acc, sale) => acc + (sale.amount || sale.total || 0), 0);
  const cashSales = sales.filter(s => s.method === 'cash').reduce((acc, sale) => acc + (sale.amount || sale.total || 0), 0);
  const cardSales = sales.filter(s => s.method === 'card').reduce((acc, sale) => acc + (sale.amount || sale.total || 0), 0);

  const handleCorteDeCaja = () => {
    if(window.confirm(`¿Estás seguro de realizar el Corte de Caja? Se reiniciarán las ventas actuales por un total de $${totalSalesAmount.toFixed(2)}`)) {
      clearSales();
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 bg-surface relative">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-1 flex-col md:flex-row items-center gap-4 w-full">
          <div className="relative flex-1 group w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="Buscar por ID, concepto o mesero..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-sm font-bold outline-none ring-primary/20 placeholder:text-foreground-subtle/50 h-16 bg-surface text-foreground shadow-neu-inset rounded-[20px] border border-white/5 focus:ring-4 transition-all"
            />
          </div>
          <Button 
            variant="outline" 
            className="h-16 px-6 gap-3 shadow-neu active-scale rounded-[20px] border border-white/5 bg-surface"
            onClick={() => exportToCSV(sales, 'Ventas_ElOtroRollo')}
          >
            <Download className="w-5 h-5 text-primary" />
            <span className="font-black text-[11px] uppercase tracking-widest">Exportar</span>
          </Button>
        </div>
        <button 
          onClick={handleCorteDeCaja} 
          className="h-16 px-8 flex items-center gap-3 bg-danger text-danger-foreground font-black text-[13px] uppercase tracking-widest shadow-neu-glow-danger rounded-[20px] active-scale transition-all hover:opacity-90 w-full md:w-auto justify-center"
        >
          <Banknote className="w-5 h-5" />
          Corte de Caja
        </button>
      </div>

      {/* ── Dashboard Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-surface shadow-neu rounded-[28px] p-6 border border-white/5 group hover-scale transition-all">
            <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Ingresos Totales (Hoy)</p>
               <div className="p-2 rounded-xl bg-success/10 text-success">
                 <TrendingUp className="h-4 w-4" />
               </div>
            </div>
            <div className="text-3xl font-black text-foreground tracking-tighter">${totalSalesAmount.toFixed(2)}</div>
         </div>
         <div className="bg-surface shadow-neu rounded-[28px] p-6 border border-white/5 group hover-scale transition-all">
            <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Ventas en Efectivo</p>
               <div className="p-2 rounded-xl bg-warning/10 text-warning">
                 <Banknote className="h-4 w-4" />
               </div>
            </div>
            <div className="text-3xl font-black text-foreground tracking-tighter">${cashSales.toFixed(2)}</div>
         </div>
         <div className="bg-surface shadow-neu rounded-[28px] p-6 border border-white/5 group hover-scale transition-all">
            <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Ventas con Tarjeta</p>
               <div className="p-2 rounded-xl bg-primary/10 text-primary">
                 <CreditCard className="h-4 w-4" />
               </div>
            </div>
            <div className="text-3xl font-black text-foreground tracking-tighter">${cardSales.toFixed(2)}</div>
         </div>
      </div>

      {/* ── Sales List ────────────────────────────────────────────── */}
      <Card className="flex-1 flex flex-col border border-white/5 bg-surface shadow-neu rounded-[32px] overflow-hidden">
        <ScrollArea className="flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-foreground-subtle uppercase tracking-[0.2em] sticky top-0 bg-surface shadow-sm z-10 border-b border-white/5">
              <tr>
                <th className="px-8 py-5 font-black">Concepto de Venta</th>
                <th className="px-6 py-5 font-black text-center">ID Rastro</th>
                <th className="px-6 py-5 font-black text-center">Fecha y Hora</th>
                <th className="px-6 py-5 font-black text-center">Método</th>
                <th className="px-8 py-5 font-black text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSales.map(sale => {
                const isCheckout = sale.type === 'checkout';
                return (
                  <tr key={sale.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shadow-neu-inset bg-surface ${isCheckout ? 'text-primary' : 'text-success'}`}>
                          {isCheckout ? <CreditCard className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-foreground group-hover:text-primary transition-colors">{sale.concept}</p>
                          <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Responsable: {sale.waiter || 'Sistema'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-[10px] text-foreground-subtle bg-surface shadow-neu-inset px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                        #{String(sale.id).slice(-6)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-[11px] font-black text-foreground-muted uppercase tracking-wider opacity-80">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(sale.date).toLocaleString([], {hour: '2-digit', minute:'2-digit', day: '2-digit', month: 'short'})}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 shadow-neu-inset",
                        sale.method === 'cash' ? 'text-warning' : 'text-primary'
                      )}>
                        {sale.method === 'cash' ? 'Efectivo' : 'Tarjeta'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-lg font-black text-foreground tracking-tighter">
                        +${(sale.amount || sale.total || 0).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
              <CalendarDays className="w-16 h-16" />
              <p className="text-sm font-black uppercase tracking-widest">Aún no hay transacciones</p>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
