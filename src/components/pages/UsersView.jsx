import React, { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import { useUIStore } from "../../store/useUIStore";
import { Card, CardContent } from "../atoms/Card";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Modal from "../atoms/Modal";
import Badge from "../atoms/Badge";
import { Users, UserPlus, Edit2, Trash2, Key, Shield, UserCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export default function UsersView() {
  const { users, addUser, updateUser, removeUser } = useUserStore();
  const addToast = useUIStore(state => state.addToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', role: 'waiter', pin: '', color: 'bg-primary' });

  const colors = [
    'bg-primary', 'bg-orange-500', 'bg-emerald-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-blue-500'
  ];

  const handleOpenAdd = () => {
    setEditingUser(null);
    setUserForm({ name: '', role: 'waiter', pin: '', color: 'bg-primary' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setUserForm({ name: user.name, role: user.role, pin: user.pin, color: user.color });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.pin) return addToast('Nombre y PIN son obligatorios', 'error');

    if (editingUser) {
      updateUser(editingUser.id, userForm);
      addToast('Usuario actualizado', 'success');
    } else {
      addUser(userForm);
      addToast('Usuario registrado con éxito', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (users.length <= 1) return addToast('Debe haber al menos un usuario administrador', 'error');
    if (window.confirm(`¿Seguro que deseas eliminar a ${name}?`)) {
      removeUser(id);
      addToast('Usuario eliminado', 'success');
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">Gestión de Talento</h2>
          <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.25em] opacity-40 mt-1">Control de Accesos y Privilegios</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="h-14 px-10 flex items-center gap-3 bg-success text-success-foreground font-black text-[12px] uppercase tracking-[0.2em] shadow-neu-glow-success rounded-[22px] active-scale transition-all hover:opacity-95"
        >
          <UserPlus className="w-5 h-5" /> Registrar Personal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {users.map((u) => (
          <div key={u.id} className="bg-surface shadow-neu rounded-[32px] overflow-hidden border border-white/5 group transition-all duration-500 hover:-translate-y-2">
            <div className={`h-28 ${u.color} relative overflow-hidden`}>
              {/* Decorative Glass Overlay */}
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button 
                  onClick={() => handleOpenEdit(u)} 
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/40 text-white transition-all backdrop-blur-xl border border-white/20 active-scale"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(u.id, u.name)} 
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/40 text-white transition-all backdrop-blur-xl border border-white/20 active-scale"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute -bottom-10 left-8 z-20">
                <div className="h-20 w-20 rounded-[24px] bg-surface shadow-neu flex items-center justify-center border-4 border-surface overflow-hidden">
                   <div className={cn("h-full w-full flex items-center justify-center", u.color.replace('bg-', 'text-'), "bg-white/[0.03]")}>
                      <UserCircle className="w-12 h-12" />
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 pt-14 flex flex-col gap-6">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-black text-foreground tracking-tight">{u.name}</h3>
                  <span className="text-[10px] font-black text-foreground-subtle opacity-40 uppercase tracking-widest">ID:{u.id.slice(-4)}</span>
                </div>
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full border",
                  u.role === 'admin' ? "bg-primary/10 border-primary/20 text-primary" : "bg-warning/10 border-warning/20 text-warning"
                )}>
                  {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                  <span className="text-[9px] font-black uppercase tracking-[0.15em]">
                    {u.role === 'admin' ? 'Administrador' : 'Staff / Mesero'}
                  </span>
                </div>
              </div>

              <div className="bg-surface shadow-neu-inset p-5 rounded-[20px] border border-white/5 flex items-center justify-between group-hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface shadow-neu border border-white/5">
                    <Key className="w-4 h-4 text-foreground-subtle opacity-60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-foreground-subtle uppercase tracking-widest opacity-40 leading-none mb-1">Passcode</p>
                    <p className="text-sm font-black tracking-[0.3em] text-foreground">••••</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-success shadow-neu-glow-success" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? "Refinar Perfil de Usuario" : "Apertura de Nuevo Perfil"}>
        <form onSubmit={handleSave} className="space-y-8 p-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">Identidad Legal / Alias</label>
              <input 
                required autoFocus
                value={userForm.name}
                onChange={e => setUserForm({...userForm, name: e.target.value})}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all text-foreground"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">Nivel de Acceso</label>
              <div className="relative">
                <select 
                  value={userForm.role}
                  onChange={e => setUserForm({...userForm, role: e.target.value})}
                  className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-sm font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all text-foreground appearance-none cursor-pointer"
                >
                  <option value="waiter">Personal de Operación</option>
                  <option value="admin">Administrador Master</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">PIN de Bio-Acceso (4 Dígitos)</label>
              <input 
                type="password" maxLength="4" required
                value={userForm.pin}
                onChange={e => setUserForm({...userForm, pin: e.target.value})}
                placeholder="0000"
                className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-center text-xl font-black tracking-[0.5em] outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all text-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-4 block opacity-60">Banner de Identidad Visual</label>
            <div className="flex gap-4 justify-between">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setUserForm({...userForm, color: c})}
                  className={cn(
                    "w-12 h-12 rounded-2xl transition-all duration-300 relative overflow-hidden border-2",
                    c,
                    userForm.color === c 
                      ? "border-white scale-110 shadow-neu-glow-primary z-10" 
                      : "border-transparent opacity-40 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                  )}
                >
                   {userForm.color === c && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-6 flex items-center justify-center gap-3 bg-gradient-to-r from-success to-emerald-600 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-neu-glow-success rounded-[24px] active-scale transition-all hover:opacity-95">
            <UserPlus className="w-5 h-5" /> {editingUser ? "Sincronizar Cambios" : "Propagar Nuevo Registro"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
