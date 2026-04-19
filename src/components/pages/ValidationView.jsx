import React, { useState } from "react";
import { useValidationStore } from "../../store/useValidationStore";
import { useUIStore } from "../../store/useUIStore";
import { Card } from "../atoms/Card";
import { 
  QrCode, CheckCircle2, AlertCircle, 
  Search, History, ShieldCheck, 
  User, Home, Calendar, Zap
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function ValidationView() {
  const { validateToken, validations } = useValidationStore();
  const addToast = useUIStore(state => state.addToast);
  
  const [inputCode, setInputCode] = useState("");
  const [lastResult, setLastResult] = useState(null);

  const handleValidate = (e) => {
    e?.preventDefault();
    if (!inputCode) return;
    
    const result = validateToken(inputCode.toUpperCase());
    setLastResult(result);
    
    if (result.success) {
      addToast("Servicio validado", "success");
    } else {
      addToast(result.message, "error");
    }
    
    setInputCode("");
  };

  const recentValidations = [...validations]
    .filter(v => v.status === 'used')
    .sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt))
    .slice(0, 5);

  return (
    <div className="h-full flex flex-col gap-8 bg-surface max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-black text-foreground tracking-tighter mb-1 uppercase">Validación de Servicios</h1>
        <p className="text-sm font-black text-foreground-muted uppercase tracking-[0.2em] opacity-60">Escanea el código QR del ticket</p>
      </div>

      {/* ── Scanner Input ────────────────────────────────────────── */}
      <Card className="bg-surface shadow-neu rounded-[40px] p-10 flex flex-col items-center gap-8 border border-white/5">
        <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary shadow-neu-glow-primary mb-2">
          <QrCode className="w-12 h-12" />
        </div>

        <form onSubmit={handleValidate} className="w-full max-w-md space-y-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input 
              autoFocus
              placeholder="Ingresa código o escanea..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full bg-surface shadow-neu-inset rounded-[28px] pl-16 pr-6 py-6 text-2xl font-black uppercase tracking-widest outline-none border border-white/5 focus:ring-8 focus:ring-primary/5 transition-all"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full h-20 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-neu-glow-primary rounded-[28px] active-scale transition-all flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-6 h-6" />
            Validar Servicio
          </button>
        </form>
      </Card>

      {/* ── Result Animation ────────────────────────────────────── */}
      {lastResult && (
        <div className={cn(
          "p-8 rounded-[40px] shadow-neu border border-white/5 animate-in zoom-in-95 duration-300",
          lastResult.success ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20"
        )}>
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              lastResult.success ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground"
            )}>
              {lastResult.success ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>
            <div>
              <p className={cn("text-xl font-black uppercase tracking-tight", lastResult.success ? "text-success" : "text-danger")}>
                {lastResult.message}
              </p>
              {lastResult.success && (
                <p className="text-sm font-bold text-foreground opacity-70">
                  {lastResult.data.serviceName} — {lastResult.data.guestName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent History ──────────────────────────────────────── */}
      <div className="space-y-4 pb-10">
        <div className="flex items-center gap-3 px-2">
          <History className="w-4 h-4 text-primary" />
          <h3 className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] opacity-60">Validaciones Recientes</h3>
        </div>
        
        <div className="space-y-3">
          {recentValidations.length === 0 ? (
            <p className="text-center py-10 text-sm font-bold text-foreground-subtle opacity-30 italic">No hay actividad reciente</p>
          ) : (
            recentValidations.map(v => (
              <div key={v.id} className="bg-surface shadow-neu p-5 rounded-[24px] border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-surface shadow-neu-inset flex items-center justify-center text-success">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">{v.serviceName}</p>
                    <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest opacity-40">
                      {v.guestName} — Cabaña {v.cabinNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-foreground">{v.id}</p>
                  <p className="text-[9px] font-bold text-foreground-subtle uppercase opacity-40">{new Date(v.usedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
