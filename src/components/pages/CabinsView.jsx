import React, { useState } from "react";
import { useCabinStore } from "../../store/useCabinStore";
import { useUIStore } from "../../store/useUIStore";
import { Card } from "../atoms/Card";
import Button from "../atoms/Button";
import Modal from "../atoms/Modal";
import { 
  Home, Plus, Edit2, Trash2, 
  CheckCircle2, Clock, Wrench, 
  User, DollarSign, Users,
  Filter, Search, LayoutGrid,
  List, ShieldAlert, Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";

const statusConfig = {
  available: { 
    label: "Disponible", 
    color: "text-success", 
    bg: "bg-success/10", 
    icon: CheckCircle2,
    shadow: "shadow-neu-glow-success"
  },
  occupied: { 
    label: "Ocupada", 
    color: "text-primary", 
    bg: "bg-primary/10", 
    icon: User,
    shadow: "shadow-neu-glow-primary"
  },
  cleaning: { 
    label: "Limpieza", 
    color: "text-amber-500", 
    bg: "bg-amber-500/10", 
    icon: Clock,
    shadow: "shadow-neu-glow"
  },
  maintenance: { 
    label: "Mantenimiento", 
    color: "text-danger", 
    bg: "bg-danger/10", 
    icon: Wrench,
    shadow: "shadow-neu-glow-danger"
  }
};

export default function CabinsView() {
  const { cabins, addCabin, updateCabin, updateCabinStatus, removeCabin, cabinTypes } = useCabinStore();
  const addToast = useUIStore(state => state.addToast);
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCabin, setEditingCabin] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const [form, setForm] = useState({
    number: '',
    type: 'Estándar',
    price: '',
    capacity: '2',
    status: 'available'
  });

  const filteredCabins = cabins.filter(c => {
    const matchesSearch = c.number.toLowerCase().includes(search.toLowerCase()) || 
                          c.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingCabin(null);
    setForm({ number: '', type: 'Estándar', price: '', capacity: '2', status: 'available' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cabin) => {
    setEditingCabin(cabin);
    setForm({ ...cabin, price: cabin.price.toString(), capacity: cabin.capacity.toString() });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cabinData = {
      ...form,
      price: parseFloat(form.price),
      capacity: parseInt(form.capacity)
    };

    if (editingCabin) {
      updateCabin(editingCabin.id, cabinData);
      addToast("Cabaña actualizada correctamente", "success");
    } else {
      addCabin(cabinData);
      addToast("Nueva cabaña registrada", "success");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, number) => {
    if (window.confirm(`¿Seguro que deseas eliminar la cabaña ${number}?`)) {
      removeCabin(id);
      addToast("Cabaña eliminada", "success");
    }
  };

  const cycleStatus = (id, currentStatus) => {
    const statuses = ['available', 'occupied', 'cleaning', 'maintenance'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    updateCabinStatus(id, statuses[nextIndex]);
    addToast("Estado de cabaña actualizado", "success");
  };

  return (
    <div className="h-full flex flex-col gap-8 bg-surface">
      {/* ── Header & Stats ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter mb-1 uppercase">Gestión de Cabañas</h1>
          <p className="text-sm font-black text-foreground-muted uppercase tracking-[0.2em] opacity-60">Control de disponibilidad y estados</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-surface shadow-neu-inset p-1.5 rounded-[22px] border border-white/5">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-3 rounded-xl transition-all", viewMode === "grid" ? "bg-primary text-primary-foreground shadow-neu" : "text-foreground-subtle")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-3 rounded-xl transition-all", viewMode === "list" ? "bg-primary text-primary-foreground shadow-neu" : "text-foreground-subtle")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="h-14 px-8 bg-success text-success-foreground font-black text-[13px] uppercase tracking-widest shadow-neu-glow-success rounded-[22px] active-scale transition-all hover:opacity-90 flex items-center gap-3 flex-1 md:flex-none justify-center"
          >
            <Plus className="w-5 h-5" />
            Añadir Cabaña
          </button>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
          <input 
            placeholder="Buscar por número o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-sm font-bold outline-none ring-primary/10 placeholder:text-foreground-subtle/50 h-16 bg-surface text-foreground shadow-neu-inset rounded-[24px] border border-white/5 focus:ring-4 transition-all"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {["all", "available", "occupied", "cleaning", "maintenance"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-6 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest border border-white/5 transition-all whitespace-nowrap active-scale",
                filterStatus === status 
                  ? "bg-primary text-primary-foreground shadow-neu-glow" 
                  : "bg-surface shadow-neu text-foreground-subtle hover:text-foreground"
              )}
            >
              {status === "all" ? "Todas" : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main View ────────────────────────────────────────────── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
          {filteredCabins.map(cabin => {
            const config = statusConfig[cabin.status];
            const StatusIcon = config.icon;
            
            return (
              <Card key={cabin.id} className="group relative bg-surface border border-white/5 shadow-neu rounded-[40px] p-6 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Status Badge Floating */}
                <div className={cn(
                  "absolute top-6 right-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2",
                  config.bg, config.color
                )}>
                  <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.bg.replace('/10', ''))} />
                  {config.label}
                </div>

                <div className="flex flex-col items-center text-center mt-4">
                  <div className={cn(
                    "w-24 h-24 rounded-[32px] bg-surface shadow-neu-inset flex items-center justify-center mb-6 border border-white/5 group-hover:shadow-neu transition-all duration-500",
                    cabin.status === 'occupied' && "shadow-neu-glow-primary"
                  )}>
                    <Home className={cn("w-10 h-10", cabin.status === 'available' ? "text-success" : "text-foreground-subtle/40")} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-foreground tracking-tighter mb-1">Cabaña {cabin.number}</h3>
                  <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-4 opacity-60">{cabin.type}</p>
                  
                  <div className="flex gap-6 mb-8 w-full justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black text-foreground">{cabin.capacity}</span>
                      <span className="text-[8px] font-black text-foreground-subtle uppercase tracking-widest opacity-40">Capacidad</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/5" />
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black text-primary">${cabin.price}</span>
                      <span className="text-[8px] font-black text-foreground-subtle uppercase tracking-widest opacity-40">Precio/Noche</span>
                    </div>
                  </div>

                  {cabin.currentGuest && (
                    <div className="w-full bg-surface shadow-neu-inset rounded-[20px] p-3 mb-6 flex items-center gap-3 border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                       <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                          <User className="w-4 h-4" />
                       </div>
                       <div className="text-left">
                          <p className="text-[9px] font-black text-foreground-subtle uppercase tracking-widest opacity-40">Huésped Actual</p>
                          <p className="text-[11px] font-black text-foreground truncate">{cabin.currentGuest}</p>
                       </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 w-full">
                    <button 
                      onClick={() => cycleStatus(cabin.id, cabin.status)}
                      className="h-12 flex items-center justify-center rounded-2xl bg-surface shadow-neu border border-white/5 text-foreground-subtle hover:text-primary active-scale transition-all"
                      title="Cambiar Estado"
                    >
                      <StatusIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleOpenEdit(cabin)}
                      className="h-12 flex items-center justify-center rounded-2xl bg-surface shadow-neu border border-white/5 text-foreground-subtle hover:text-amber-500 active-scale transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cabin.id, cabin.number)}
                      className="h-12 flex items-center justify-center rounded-2xl bg-surface shadow-neu border border-white/5 text-foreground-subtle hover:text-danger active-scale transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List Mode View */
        <Card className="flex-1 bg-surface border border-white/5 shadow-neu rounded-[32px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Cabaña</th>
                <th className="px-6 py-6 text-center">Tipo</th>
                <th className="px-6 py-6 text-center">Estado</th>
                <th className="px-6 py-6 text-center">Capacidad</th>
                <th className="px-6 py-6 text-center">Precio</th>
                <th className="px-8 py-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCabins.map(cabin => {
                const config = statusConfig[cabin.status];
                return (
                  <tr key={cabin.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-surface shadow-neu-inset flex items-center justify-center border border-white/5">
                          <Home className="w-5 h-5 text-foreground-subtle" />
                        </div>
                        <div>
                          <p className="text-base font-black text-foreground">#{cabin.number}</p>
                          <p className="text-[9px] font-black text-foreground-subtle uppercase tracking-widest opacity-40">ID: {cabin.id.slice(-4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[11px] font-black uppercase text-foreground-subtle opacity-60">{cabin.type}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => cycleStatus(cabin.id, cabin.status)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 active-scale",
                          config.bg, config.color
                        )}
                      >
                        {config.label}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="flex items-center justify-center gap-2 font-black text-sm text-foreground">
                        <Users className="w-3.5 h-3.5 opacity-30" /> {cabin.capacity}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-primary">${cabin.price}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-3">
                          <button onClick={() => handleOpenEdit(cabin)} className="h-10 w-10 flex items-center justify-center rounded-xl shadow-neu bg-surface text-foreground-subtle hover:text-primary active-scale transition-all border border-white/5">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cabin.id, cabin.number)} className="h-10 w-10 flex items-center justify-center rounded-xl shadow-neu bg-surface text-foreground-subtle hover:text-danger active-scale transition-all border border-white/5">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* ── Modal ──────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCabin ? "Editar Cabaña" : "Nueva Cabaña"}
        className="max-w-xl rounded-[40px]"
      >
        <form onSubmit={handleSubmit} className="space-y-8 p-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest ml-1 opacity-60">Número</label>
              <input 
                required autoFocus
                placeholder="Ej. 101"
                value={form.number}
                onChange={e => setForm({...form, number: e.target.value})}
                className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-4 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest ml-1 opacity-60">Tipo</label>
              <select 
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-4 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
              >
                {cabinTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest ml-1 opacity-60">Precio x Noche</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input 
                  type="number" required min="0"
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full bg-surface shadow-neu-inset rounded-[20px] pl-10 pr-6 py-4 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest ml-1 opacity-60">Capacidad (Pax)</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input 
                  type="number" required min="1"
                  placeholder="2"
                  value={form.capacity}
                  onChange={e => setForm({...form, capacity: e.target.value})}
                  className="w-full bg-surface shadow-neu-inset rounded-[20px] pl-10 pr-6 py-4 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest ml-1 opacity-60">Estado Inicial</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({...form, status: key})}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-3xl border border-white/5 transition-all active-scale",
                    form.status === key ? "bg-surface shadow-neu-inset " + cfg.color : "bg-surface shadow-neu text-foreground-subtle opacity-40"
                  )}
                >
                  <cfg.icon className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-16 bg-primary text-primary-foreground font-black text-[13px] uppercase tracking-widest shadow-neu-glow-primary rounded-[24px] active-scale transition-all hover:opacity-90 flex items-center justify-center gap-3 mt-4"
          >
            {editingCabin ? <Sparkles className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingCabin ? "Actualizar Información" : "Registrar Cabaña"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
