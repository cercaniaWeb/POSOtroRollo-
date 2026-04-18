import React, { useState } from "react";
import { useInventoryStore } from "../../store/useInventoryStore";
import { useUIStore } from "../../store/useUIStore";
import { Card, CardContent } from "../atoms/Card";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import ScrollArea from "../atoms/ScrollArea";
import Input from "../atoms/Input";
import Modal from "../atoms/Modal";
import { 
  Search, Plus, Edit2, Trash2, Package, Tag, 
  DollarSign, ArchiveRestore, Image as ImageIcon, 
  Upload, Wand2, Sparkles, Loader2, AlertTriangle, Download
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import { exportToCSV } from "../../utils/exportUtils";
import { cn } from "../../lib/utils";

export default function InventoryView() {
  const { products, addProduct, updateProduct, removeProduct, categories, lowStockThreshold } = useInventoryStore();
  const addToast = useUIStore(state => state.addToast);
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: 'Cocina', price: '', stock: '', image: '' });
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const handleRemoveBg = async () => {
    if (!productForm.image) return;
    setIsRemovingBg(true);
    try {
      const blob = await removeBackground(productForm.image);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result });
        setIsRemovingBg(false);
        addToast('Fondo removido con éxito', 'success');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      addToast('Error al remover el fondo', 'error');
      setIsRemovingBg(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeTab === "Todos" || p.category === activeTab;
    return matchSearch && matchCat;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Cocina', price: '', stock: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    if (!product) return;
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      category: product.category || 'Cocina',
      price: (product.price !== null && product.price !== undefined) ? product.price.toString() : '0',
      stock: (product.stock === Infinity || product.stock === undefined || product.stock === null) ? '' : product.stock.toString(),
      image: product.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      return addToast('El nombre y el precio son obligatorios', 'error');
    }
    
    const parsedPrice = parseFloat(productForm.price);
    const parsedStock = productForm.stock === '' ? Infinity : parseInt(productForm.stock, 10);
    
    if (isNaN(parsedPrice)) {
      return addToast('El precio debe ser un número válido', 'error');
    }

    const productData = {
      name: productForm.name,
      category: productForm.category,
      price: parsedPrice,
      stock: parsedStock,
      image: productForm.image,
      emoji: !productForm.image ? '📦' : null,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      addToast('Producto actualizado', 'success');
    } else {
      addProduct({ ...productData, id: Date.now().toString() });
      addToast('Producto agregado al inventario', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if(window.confirm(`¿Seguro que deseas eliminar ${name}?`)) {
      removeProduct(id);
      addToast('Producto eliminado', 'success');
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
              placeholder="Buscar productos por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-sm font-bold outline-none ring-primary/20 placeholder:text-foreground-subtle/50 h-16 bg-surface text-foreground shadow-neu-inset rounded-[20px] border border-white/5 focus:ring-4 transition-all"
            />
          </div>
          <Button 
            variant="outline" 
            className="h-16 px-6 gap-3 shadow-neu active-scale rounded-[20px] border border-white/5 bg-surface"
            onClick={() => exportToCSV(products, 'Inventario_ElOtroRollo')}
          >
            <Download className="w-5 h-5 text-primary" />
            <span className="font-black text-[11px] uppercase tracking-widest">Exportar</span>
          </Button>
        </div>
        <button 
          onClick={openAddModal} 
          className="h-16 px-8 flex items-center gap-3 bg-success text-success-foreground font-black text-[13px] uppercase tracking-widest shadow-neu-glow-success rounded-[20px] active-scale transition-all hover:opacity-90 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* ── Filtros Categoría ────────────────────────────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none pt-2">
        {["Todos", ...categories].map(cat => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 whitespace-nowrap transition-all duration-300 flex-shrink-0 font-black text-[11px] uppercase tracking-wider rounded-[18px] border border-white/5 active-scale",
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-neu-glow' 
                  : 'bg-surface shadow-neu text-foreground-subtle hover:text-foreground hover:bg-white/[0.02]'
              )}
            >
              <Tag className={cn("w-3.5 h-3.5", isActive ? "opacity-100" : "opacity-40")} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Tabla Data ────────────────────────────────────────────── */}
      <Card className="flex-1 flex flex-col border border-white/5 bg-surface shadow-neu rounded-[32px] overflow-hidden">
        <ScrollArea className="flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-foreground-subtle uppercase tracking-[0.2em] sticky top-0 bg-surface shadow-sm z-10 border-b border-white/5">
              <tr>
                <th className="px-8 py-5 font-black">Producto</th>
                <th className="px-6 py-5 font-black text-center">Categoría</th>
                <th className="px-6 py-5 font-black text-center">Precio</th>
                <th className="px-6 py-5 font-black text-center">Disponibilidad</th>
                <th className="px-8 py-5 font-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(product => {
                const isLowStock = product.stock <= lowStockThreshold && product.stock !== Infinity;
                return (
                  <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[20px] bg-surface shadow-neu-inset flex items-center justify-center p-2 text-2xl relative border border-white/5 group-hover:shadow-neu transition-all duration-500">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain rounded-xl group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <span className="opacity-40">{product.emoji || '📦'}</span>
                          )}
                          {isLowStock && (
                            <div className="absolute -top-1 -right-1 bg-danger text-white rounded-full p-1.5 shadow-neu-glow-danger animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest opacity-60">REF: {product.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-4 py-1.5 rounded-full bg-surface shadow-neu-inset text-[10px] font-black uppercase tracking-widest text-foreground-subtle border border-white/5">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-base font-black text-primary tracking-tighter">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={cn(
                          "text-[13px] font-black tracking-tight flex items-center gap-1.5",
                          isLowStock ? 'text-danger' : 'text-success'
                        )}>
                          {product.stock === Infinity ? 'Ilimitado' : `${product.stock} unidades`}
                        </span>
                        {isLowStock && (
                          <span className="text-[9px] font-black text-danger uppercase tracking-tighter opacity-80">Stock Crítico</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEditModal(product)} className="h-10 w-10 flex items-center justify-center rounded-xl shadow-neu bg-surface text-foreground-subtle hover:text-primary active-scale transition-all border border-white/5">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id, product.name)} className="h-10 w-10 flex items-center justify-center rounded-xl shadow-neu bg-surface text-foreground-subtle hover:text-danger active-scale transition-all border border-white/5">
                            <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
              <ArchiveRestore className="w-16 h-16" />
              <p className="text-sm font-black uppercase tracking-widest">No se encontraron productos</p>
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* ── Modal Producto (Añadir/Editar) ────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? "Editar Producto" : "Nuevo Inventario"}
        className="max-w-xl rounded-[32px]"
      >
         <form onSubmit={handleSaveProduct} className="space-y-8 p-2">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 opacity-60 flex items-center gap-2">
                 <Package className="w-3.5 h-3.5 text-primary" /> Identidad del Producto
               </label>
               <input 
                 required autoFocus
                 placeholder="Nombre del producto o servicio..." 
                 value={productForm.name}
                 onChange={e => setProductForm({...productForm, name: e.target.value})}
                 className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 opacity-60 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-primary" /> Valor Comercial
                  </label>
                  <input 
                    type="number" step="0.01" min="0" required
                    placeholder="0.00" 
                    value={productForm.price}
                    onChange={e => setProductForm({...productForm, price: e.target.value})}
                    className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 opacity-60 flex items-center gap-2">
                    <ArchiveRestore className="w-3.5 h-3.5 text-primary" /> Stock Inicial
                  </label>
                  <input 
                    type="number" min="0"
                    placeholder="∞ Ilimitado" 
                    value={productForm.stock}
                    onChange={e => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 opacity-60 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-primary" /> Clasificación
                  </label>
                  <select 
                    value={productForm.category}
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                    className="w-full bg-surface shadow-neu-inset rounded-[20px] px-6 py-5 text-base font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 opacity-60 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" /> Media Visual
                  </label>
                  <div className="p-6 rounded-[28px] bg-surface shadow-neu border border-white/5 space-y-6">
                    <div className="flex gap-3">
                      <input 
                        placeholder="URL de imagen externa..." 
                        value={productForm.image}
                        onChange={e => setProductForm({...productForm, image: e.target.value})}
                        className="flex-1 bg-surface shadow-neu-inset rounded-xl px-4 py-3 text-sm font-bold border border-white/5 outline-none"
                      />
                      <label className="h-12 w-12 rounded-xl bg-surface shadow-neu flex items-center justify-center cursor-pointer hover:shadow-neu-inset transition-all text-primary active-scale border border-white/5" title="Cargar archivo local">
                         <Upload className="w-5 h-5" />
                         <input 
                           type="file" 
                           className="hidden" 
                           accept="image/*"
                           onChange={(e) => {
                             const file = e.target.files[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 setProductForm({...productForm, image: reader.result});
                               };
                               reader.readAsDataURL(file);
                             }
                           }}
                         />
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-32 h-32 rounded-[24px] bg-surface shadow-neu-inset flex items-center justify-center relative border border-white/5 overflow-hidden group">
                        {productForm.image ? (
                          <>
                            <img src={productForm.image} alt="prev" className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110" />
                            <button 
                              type="button"
                              onClick={() => setProductForm({...productForm, image: ''})}
                              className="absolute inset-0 bg-danger/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                            >
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </>
                        ) : (
                           <div className="text-center opacity-30">
                              <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Sin Media</span>
                           </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <button
                          type="button"
                          onClick={() => handleRemoveBg()}
                          disabled={isRemovingBg || !productForm.image}
                          className={cn(
                            "w-full h-14 flex items-center justify-center gap-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all active-scale shadow-neu border border-white/5",
                            isRemovingBg ? 'animate-pulse bg-surface text-primary' : 'bg-primary text-primary-foreground shadow-neu-glow'
                          )}
                        >
                          {isRemovingBg ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Analizando...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4" />
                              <span>Remover Fondo (IA)</span>
                            </>
                          )}
                        </button>
                        <p className="text-[10px] font-bold text-foreground-subtle text-center opacity-60 leading-relaxed">
                          La inteligencia artificial aislará el producto automáticamente.
                        </p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              className="w-full h-16 flex items-center justify-center gap-3 bg-success text-success-foreground font-black text-[13px] uppercase tracking-widest shadow-neu-glow-success rounded-[22px] active-scale transition-all hover:opacity-90"
            >
               {editingProduct ? <Sparkles className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
               {editingProduct ? "Actualizar Inventario" : "Registrar Producto"}
            </button>
         </form>
      </Modal>

    </div>
  );
}
