import React, { useState } from "react";
import { useSupplierStore } from "../../store/useSupplierStore";
import { useInventoryStore } from "../../store/useInventoryStore";
import { usePurchaseStore } from "../../store/usePurchaseStore";
import { Card } from "../atoms/Card";
import ScrollArea from "../atoms/ScrollArea";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Search, Plus, Minus, ShoppingCart, Truck, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function PurchasesView() {
  const { suppliers } = useSupplierStore();
  const { products, updateProduct } = useInventoryStore();
  const { addPurchase } = usePurchaseStore();

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [purchaseCart, setPurchaseCart] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()));

  const handleAddProduct = (product) => {
    const existing = purchaseCart.find(p => p.id === product.id);
    if (existing) {
      setPurchaseCart(purchaseCart.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
    } else {
      setPurchaseCart([...purchaseCart, { ...product, qty: 1, cost: 0 }]); // Costo de compra puede ser diferente
    }
  };

  const handleUpdateQty = (id, delta) => {
    setPurchaseCart(purchaseCart.map(p => {
      if (p.id === id) {
        const newQty = p.qty + delta;
        return newQty > 0 ? { ...p, qty: newQty } : null;
      }
      return p;
    }).filter(Boolean));
  };

  const handleUpdateCost = (id, cost) => {
    setPurchaseCart(purchaseCart.map(p => p.id === id ? { ...p, cost: parseFloat(cost) || 0 } : p));
  };

  const totalPurchase = purchaseCart.reduce((acc, item) => acc + (item.qty * item.cost), 0);

  const handleFinalizePurchase = () => {
    if (!selectedSupplier || purchaseCart.length === 0) return;
    if (window.confirm(`¿Confirmar compra por $${totalPurchase.toFixed(2)}?`)) {
      // 1. Guardar la compra
      const supplierName = suppliers.find(s => s.id === selectedSupplier)?.name;
      addPurchase({
        supplierId: selectedSupplier,
        supplierName,
        total: totalPurchase,
        items: purchaseCart
      });

      // 2. Actualizar stock en inventario
      purchaseCart.forEach(item => {
        const inventoryItem = products.find(p => p.id === item.id);
        if (inventoryItem) {
          const currentStock = inventoryItem.stock === Infinity ? 0 : (inventoryItem.stock || 0);
          updateProduct(item.id, { stock: currentStock + item.qty });
        }
      });

      // 3. Limpiar estado
      setPurchaseCart([]);
      setSelectedSupplier("");
      alert("Compra registrada y stock actualizado con éxito.");
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* ── Left Column: Products & Supplier Selection ── */}
      <div className="flex-1 flex flex-col gap-6">
        <Card className="p-6 bg-surface shadow-neu rounded-[32px] border border-white/5">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-black uppercase tracking-widest text-foreground-subtle">Seleccionar Proveedor</label>
            <div className="relative">
              <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <select 
                className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-surface shadow-neu-inset border border-white/5 text-sm font-bold text-foreground outline-none appearance-none"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <option value="">-- Elige un proveedor --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.contact})</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card className="flex-1 border border-white/5 bg-surface shadow-neu rounded-[32px] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Buscar productos para comprar..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-sm font-bold outline-none ring-primary/20 placeholder:text-foreground-subtle/50 h-14 bg-surface text-foreground shadow-neu-inset rounded-[20px] border border-white/5 focus:ring-4 transition-all"
              />
            </div>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className="bg-surface shadow-neu border border-white/5 rounded-[20px] p-4 flex flex-col gap-2 text-left active-scale hover:shadow-neu-glow-primary transition-all group"
                  disabled={!selectedSupplier}
                >
                  <p className="font-black text-sm text-foreground line-clamp-1">{product.name}</p>
                  <div className="flex justify-between items-end w-full">
                    <p className="text-[10px] uppercase font-bold text-foreground-muted tracking-widest">{product.category}</p>
                    <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* ── Right Column: Purchase Cart ── */}
      <Card className="w-96 flex flex-col border border-white/5 bg-surface shadow-neu rounded-[32px] overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-surface z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <ShoppingCart className="h-5 w-5" />
             </div>
             <div>
               <h3 className="font-black text-lg tracking-tighter">Lista de Compra</h3>
               <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest">
                 {purchaseCart.length} Productos
               </p>
             </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-3">
            {purchaseCart.map(item => (
              <div key={item.id} className="p-4 rounded-[20px] bg-surface shadow-neu-inset border border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm line-clamp-2">{item.name}</p>
                  <span className="text-[10px] font-black uppercase text-foreground-subtle tracking-widest">Stock: {item.stock === Infinity ? '∞' : item.stock}</span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  {/* Control cantidad */}
                  <div className="flex items-center gap-2 bg-surface shadow-neu rounded-full p-1 border border-white/5">
                    <button onClick={() => handleUpdateQty(item.id, -1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/5">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item.id, 1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/5">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* Costo Unitario */}
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-bold text-foreground-muted">$</span>
                    <input 
                      type="number"
                      placeholder="Costo u."
                      value={item.cost || ''}
                      onChange={(e) => handleUpdateCost(item.id, e.target.value)}
                      className="w-full bg-surface shadow-neu-inset border border-white/5 rounded-lg px-2 py-1 text-xs font-bold outline-none ring-primary/20 focus:ring-2"
                    />
                  </div>
                </div>
              </div>
            ))}
            {purchaseCart.length === 0 && (
              <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
                <ShoppingCart className="w-8 h-8 text-foreground-muted" />
                <p className="text-xs font-bold uppercase tracking-widest">Añade productos para comprar</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-white/5 bg-surface z-10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-black text-foreground-subtle uppercase tracking-widest">Total Compra</span>
            <span className="text-2xl font-black tracking-tighter">${totalPurchase.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleFinalizePurchase}
            disabled={purchaseCart.length === 0 || !selectedSupplier}
            className="w-full h-14 bg-primary text-primary-foreground font-black text-[13px] uppercase tracking-widest shadow-neu-glow-primary rounded-[20px] active-scale transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Registrar Compra
          </button>
        </div>
      </Card>
    </div>
  );
}
