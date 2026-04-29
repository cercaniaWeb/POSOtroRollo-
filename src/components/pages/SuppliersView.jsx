import React, { useState } from "react";
import { useSupplierStore } from "../../store/useSupplierStore";
import { Card } from "../atoms/Card";
import ScrollArea from "../atoms/ScrollArea";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Modal from "../atoms/Modal";
import { Search, Plus, Truck, Building2, Phone, Mail, MapPin, BriefcaseBusiness, Trash2 } from "lucide-react";

export default function SuppliersView() {
  const { suppliers, addSupplier, deleteSupplier } = useSupplierStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rfc: "",
    contact: "",
    phone: "",
    email: "",
    address: ""
  });

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.contact) {
      addSupplier(formData);
      setFormData({ name: "", rfc: "", contact: "", phone: "", email: "", address: "" });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar a este proveedor?")) {
      deleteSupplier(id);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
          <input 
            placeholder="Buscar proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-sm font-bold outline-none ring-primary/20 placeholder:text-foreground-subtle/50 h-16 bg-surface text-foreground shadow-neu-inset rounded-[20px] border border-white/5 focus:ring-4 transition-all"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-16 px-8 flex items-center gap-3 bg-primary text-primary-foreground font-black text-[13px] uppercase tracking-widest shadow-neu-glow-primary rounded-[20px] active-scale transition-all hover:opacity-90 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      <Card className="flex-1 border border-white/5 bg-surface shadow-neu rounded-[32px] overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSuppliers.map(supplier => (
              <div key={supplier.id} className="bg-surface shadow-neu-inset border border-white/5 rounded-[24px] p-6 flex flex-col gap-4 relative group">
                <button 
                  onClick={() => handleDelete(supplier.id)}
                  className="absolute top-4 right-4 p-2 text-foreground-muted hover:text-danger hover:bg-danger/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-foreground tracking-tight">{supplier.name}</h3>
                    <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest">{supplier.rfc}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-3 text-sm text-foreground-muted">
                    <BriefcaseBusiness className="w-4 h-4 text-primary" />
                    <span>{supplier.contact}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground-muted">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{supplier.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground-muted">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{supplier.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground-muted">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="line-clamp-1">{supplier.address || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredSuppliers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
              <Building2 className="w-16 h-16" />
              <p className="text-sm font-black uppercase tracking-widest">No hay proveedores registrados</p>
            </div>
          )}
        </ScrollArea>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Proveedor">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Input 
            label="Empresa / Razón Social" 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <Input 
            label="RFC" 
            value={formData.rfc} 
            onChange={(e) => setFormData({...formData, rfc: e.target.value})} 
          />
          <Input 
            label="Persona que atiende" 
            required 
            value={formData.contact} 
            onChange={(e) => setFormData({...formData, contact: e.target.value})} 
          />
          <Input 
            label="Teléfono" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          />
          <Input 
            label="Correo Electrónico" 
            type="email"
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <Input 
            label="Dirección" 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})} 
          />
          <Button type="submit" variant="primary" className="mt-2 py-4 shadow-neu-glow-primary">
            Guardar Proveedor
          </Button>
        </form>
      </Modal>
    </div>
  );
}
