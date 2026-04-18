import React from "react";
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from "recharts";
import { useSalesStore } from "../../store/useSalesStore";
import { useInventoryStore } from "../../store/useInventoryStore";
import { Card, CardContent } from "../atoms/Card";
import Badge from "../atoms/Badge";
import ScrollArea from "../atoms/ScrollArea";
import { TrendingUp, ShoppingBag, DollarSign, Users, Award, Zap, AlertTriangle } from "lucide-react";

export default function DashboardView() {
  const { sales } = useSalesStore();
  const { products, lowStockThreshold } = useInventoryStore();

  const criticalItems = products
    .filter(p => (p.stock || 0) <= lowStockThreshold && p.stock !== Infinity)
    .sort((a,b) => a.stock - b.stock);

  // ── Procesamiento de Datos ──────────────────────────────────────

  // 1. Calcular Totales
  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || s.total || 0), 0);
  const totalTransactions = sales.length;
  const avgTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // 2. Ventas por Día (Últimos 7 días)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    return d.toISOString().split('T')[0];
  }).reverse();

  const salesTrendData = last7Days.map(day => {
    const dailyTotal = sales
      .filter(s => s.date.startsWith(day))
      .reduce((sum, s) => sum + (s.amount || s.total || 0), 0);
    
    return {
      name: new Date(day).toLocaleDateString('es-MX', { weekday: 'short' }),
      ventas: dailyTotal
    };
  });

  // 3. Productos más Vendidos
  const productCount = {};
  sales.forEach(sale => {
    (sale.cart || []).forEach(item => {
      productCount[item.name] = (productCount[item.name] || 0) + item.qty;
    });
  });

  const topProductsData = Object.entries(productCount)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // 4. Métodos de Pago
  const methodData = [
    { name: 'Efectivo', value: sales.filter(s => s.method === 'cash').length, color: '#10B981' },
    { name: 'Tarjeta', value: sales.filter(s => s.method === 'card').length, color: '#3B82F6' },
  ];

  const stats = [
    { label: "Ingresos Totales", val: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Transacciones", val: totalTransactions, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Ticket Promedio", val: `$${avgTicket.toFixed(2)}`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Clientes Hoy", val: sales.filter(s => s.date.startsWith(new Date().toISOString().split('T')[0])).length, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Card key={i} className="border border-white/5 shadow-neu hover-scale active-scale cursor-pointer transition-all duration-300 rounded-[28px] overflow-hidden bg-surface group">
            <CardContent className="p-8 flex flex-col gap-6">
              <div className="flex justify-between items-start w-full">
                <div className={`p-4 rounded-[20px] ${s.bg} shadow-neu transition-transform duration-500 group-hover:rotate-6`}>
                  <s.icon className={`h-7 w-7 ${s.color}`} />
                </div>
                <div className="flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-[10px] font-black text-success">+12%</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2 opacity-60">{s.label}</p>
                <p className="text-4xl font-black text-foreground tracking-tighter leading-none">{s.val}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Area Chart: Tendencia ────────────────────────────────────── */}
        <Card className="lg:col-span-2 border border-white/5 shadow-neu p-10 rounded-[32px] bg-surface">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-80">Rendimiento Semanal</p>
              <h3 className="text-3xl font-black text-foreground tracking-tighter">Análisis de Flujo de Caja</h3>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex flex-col items-end">
                  <span className="text-[11px] font-black text-success bg-success/10 px-4 py-2 rounded-full border border-success/20 shadow-neu-sm">CRECIMIENTO SALUDABLE</span>
                  <p className="text-[10px] text-foreground-subtle font-black mt-2 uppercase tracking-widest opacity-60">En comparación al periodo anterior</p>
               </div>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--color-foreground-subtle)" opacity={0.05} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 900, fill: 'var(--color-foreground-muted)', textTransform: 'uppercase'}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 900, fill: 'var(--color-foreground-muted)'}} 
                />
                <Tooltip 
                  cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.95)', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(20px)',
                    padding: '20px'
                  }}
                  itemStyle={{ fontWeight: 900, fontSize: '18px', color: 'var(--color-foreground)' }}
                  labelStyle={{ marginBottom: '10px', color: 'var(--color-primary)', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="var(--color-primary)" 
                  strokeWidth={6} 
                  fillOpacity={1} 
                  fill="url(#colorVentas)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ── Pie Chart: Métodos ────────────────────────────────────── */}
        <Card className="border border-white/5 shadow-neu bg-surface p-10 rounded-[32px] flex flex-col">
          <div className="mb-8">
            <p className="text-[10px] font-black text-warning uppercase tracking-[0.2em] mb-2 opacity-80">Distribución de Pagos</p>
            <h3 className="text-2xl font-black text-foreground tracking-tighter">Mix de Ingresos</h3>
          </div>
          <div className="flex-1 min-h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {methodData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none" 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.95)', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">Total Hoy</p>
                    <p className="text-2xl font-black text-foreground">${totalRevenue.toFixed(0)}</p>
                </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {methodData.map((m, i) => (
              <div key={i} className="flex flex-col p-4 rounded-2xl bg-surface shadow-neu-inset border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest">{m.name}</span>
                </div>
                <p className="text-xl font-black text-foreground">{m.value} ops</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Top Productos ────────────────────────────────────── */}
        <Card className="border border-white/5 shadow-neu bg-surface p-10 rounded-[32px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2 opacity-80">Ránking de Ventas</p>
              <h3 className="text-2xl font-black text-foreground tracking-tighter">Productos "Estrella"</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
               <Award className="h-6 w-6" />
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-foreground-subtle)" opacity={0.05} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fontWeight: 900, fill: 'var(--color-foreground)'}} 
                  width={140} 
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                />
                <Bar dataKey="qty" radius={[0, 12, 12, 0]} barSize={35} animationDuration={1500}>
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#EC4899'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ── Alertas de Stock ────────────────────────────────────── */}
        <Card className="border border-white/5 shadow-neu bg-surface p-10 rounded-[32px] flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[10px] font-black text-danger uppercase tracking-[0.2em] mb-2 opacity-80">Gestión de Almacén</p>
              <h3 className="text-2xl font-black text-foreground tracking-tighter">Alertas de Inventario</h3>
            </div>
            {criticalItems.length > 0 && (
              <div className="flex items-center gap-2 bg-danger/10 px-4 py-2 rounded-full border border-danger/20 animate-pulse">
                <AlertTriangle className="h-4 w-4 text-danger" />
                <span className="text-[11px] font-black text-danger uppercase tracking-widest">{criticalItems.length} Críticos</span>
              </div>
            )}
          </div>
          
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4">
              {criticalItems.length > 0 ? criticalItems.map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-5 rounded-[24px] bg-surface shadow-neu border border-white/5 group hover:border-danger/20 transition-all duration-300">
                  <div className="w-16 h-16 rounded-[20px] bg-surface shadow-neu-inset flex items-center justify-center p-2 border border-white/5 relative group-hover:shadow-neu transition-all">
                    {item.image ? (
                        <img src={item.image} className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <span className="text-3xl opacity-40">{item.emoji || '📦'}</span>
                    )}
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-danger rounded-full flex items-center justify-center shadow-neu-glow-danger border-2 border-surface">
                        <AlertTriangle className="h-2.5 w-2.5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-base text-foreground group-hover:text-danger transition-colors">{item.name}</p>
                    <p className="text-[10px] text-foreground-subtle uppercase font-black tracking-widest opacity-60">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-danger tracking-tighter">{item.stock} pz</p>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-1">Reabastecer</button>
                  </div>
                </div>
              )) : (
                <div className="h-[250px] flex flex-col items-center justify-center text-foreground-muted opacity-40 space-y-6">
                  <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20 shadow-neu">
                    <Zap className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-lg uppercase tracking-widest">¡Stock Optimizado!</p>
                    <p className="text-sm font-bold mt-1">No se detectan productos en nivel crítico.</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

    </div>
  );
}
