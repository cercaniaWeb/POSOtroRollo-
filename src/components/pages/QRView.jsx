import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { QrCode, Download, Link2, Printer } from "lucide-react";

export default function QRView() {
  const [tableNumber, setTableNumber] = useState("Mesa 1");
  const baseUrl = "https://menu.elotrorollo.com";
  
  // En un caso real, la URL de la mesa llevaría un token o id
  const finalUrl = `${baseUrl}/?table=${encodeURIComponent(tableNumber)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col gap-10 bg-surface relative animate-in fade-in duration-700">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase flex items-center gap-4">
              <QrCode className="w-8 h-8 text-primary" /> Menú Inteligente <span className="text-foreground-subtle opacity-20">/</span> QR Lab
           </h2>
           <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.25em] opacity-40 mt-1 ml-12">Despliegue de Experiencias Digitales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
        {/* Panel Izquierdo: Configuración */}
        <div className="flex flex-col gap-8">
           <div className="bg-surface shadow-neu rounded-[36px] p-10 border border-white/5 space-y-8">
              <div>
                 <h3 className="text-lg font-black text-foreground tracking-tight mb-6 uppercase flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Segmentación de Punto
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] ml-2 mb-3 block opacity-60">Identificador de Mesa o Zona</label>
                       <input 
                         value={tableNumber}
                         onChange={(e) => setTableNumber(e.target.value)}
                         placeholder="Ej. Mesa 12, VIP, Barra..."
                         className="w-full bg-surface shadow-neu-inset rounded-[22px] px-8 py-6 text-xl font-black outline-none border border-white/5 focus:ring-4 focus:ring-primary/5 transition-all text-primary"
                       />
                    </div>
                    
                    <div className="bg-surface shadow-neu-inset p-6 rounded-[24px] border border-white/5">
                       <label className="text-[10px] font-black text-foreground-subtle mb-3 flex items-center gap-2 uppercase tracking-widest opacity-40">
                          <Link2 className="w-3 h-3" /> Punto de Enlace Destino
                       </label>
                       <p className="text-sm font-mono text-primary/80 truncate font-black tracking-tight bg-white/5 p-4 rounded-xl border border-white/5">
                         {finalUrl}
                       </p>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                 <button 
                   onClick={handlePrint} 
                   className="flex-1 h-14 flex items-center justify-center gap-3 bg-surface shadow-neu rounded-[22px] text-foreground font-black text-[11px] uppercase tracking-[0.2em] border border-white/5 active-scale transition-all hover:bg-white/[0.02]"
                 >
                    <Printer className="w-5 h-5 opacity-40" />
                    Imprimir Código
                 </button>
                 <button className="flex-1 h-14 flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-[0.2em] shadow-neu-glow-primary rounded-[22px] active-scale transition-all hover:opacity-95">
                    <Download className="w-5 h-5" />
                    Exportar Assets
                 </button>
              </div>
           </div>
           
           <div className="bg-surface shadow-neu rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <QrCode className="h-20 w-20" />
              </div>
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                 Estrategia Digital
              </p>
              <p className="text-sm font-bold text-foreground-subtle leading-relaxed">
                 Ubica el código QR en soportes de acrílico premium. El cliente escanea el menú, accede a las promociones vigentes y puede enviar órdenes directas a cocina si habilitas el modo <strong>Self-Service</strong>.
              </p>
           </div>
        </div>

        {/* Panel Derecho: Visualización del QR */}
        <div className="flex items-center justify-center bg-surface shadow-neu-inset rounded-[48px] p-12 border border-white/5 relative overflow-hidden min-h-[500px]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
           
           <div className="bg-surface shadow-[0_32px_80px_rgba(0,0,0,0.3)] rounded-[40px] border border-white/10 w-full max-w-sm aspect-[3/4.5] flex flex-col items-center p-10 z-10 transition-all duration-700 hover:scale-[1.02] print:shadow-none print:border-none">
              <div className="text-center mb-12">
                 <h1 className="text-3xl font-black text-foreground uppercase tracking-[0.3em] leading-tight">EL OTRO<br/>ROLLO</h1>
                 <div className="h-1 w-12 bg-primary mx-auto mt-4 rounded-full" />
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-3 opacity-60">Escanea & Ordena</p>
              </div>
              
              <div className="bg-white p-8 rounded-[3rem] shadow-neu flex items-center justify-center border-8 border-surface">
                 <QRCodeSVG 
                    value={finalUrl} 
                    size={200}
                    bgColor={"#FFFFFF"}
                    fgColor={"#000000"} 
                    level={"H"}
                    includeMargin={false}
                 />
              </div>
              
              <div className="mt-auto w-full pt-10 border-t border-white/5 text-center">
                 <div className="inline-block px-10 py-3 rounded-2xl bg-surface shadow-neu border border-white/5">
                    <span className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                       {tableNumber || 'Zona Global'}
                    </span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
