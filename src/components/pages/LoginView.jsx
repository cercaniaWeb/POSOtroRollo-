import React, { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import { Lock, UserCircle, X, Delete } from "lucide-react";
import { cn } from "../../lib/utils";

export default function LoginView() {
  const { users, setCurrentUser } = useUserStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setPin("");
    setError("");
  };

  const handlePinInput = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError("");

      if (newPin.length === 4) {
        // Validate PIN
        if (selectedUser.pin === newPin) {
          setCurrentUser(selectedUser);
        } else {
          setError("PIN Incorrecto");
          setTimeout(() => setPin(""), 500);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  // View: Selection of User
  if (!selectedUser) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="z-10 flex flex-col items-center">
          <div className="h-24 w-24 rounded-[32px] bg-surface flex items-center justify-center shadow-neu-inset overflow-hidden border border-white/10 mb-8">
            <img src="/logo.png" alt="El Otro Rollo" className="h-4/5 w-4/5 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter mb-2">Bienvenido</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-foreground-subtle mb-12">Selecciona tu perfil</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl px-8">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="bg-surface shadow-neu rounded-[32px] p-8 flex flex-col items-center gap-4 active-scale transition-all hover:shadow-neu-glow border border-white/5 group"
              >
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center shadow-neu-inset text-white text-2xl font-black", user.color || "bg-primary")}>
                  {user.name.charAt(0)}
                </div>
                <div className="text-center">
                  <p className="font-black text-lg text-foreground group-hover:text-primary transition-colors">{user.name}</p>
                  <p className="text-[10px] uppercase font-bold text-foreground-subtle tracking-widest">
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'manager' ? 'Encargado' : 
                     user.role === 'cashier' ? 'Cajera' : 
                     user.role === 'kitchen' ? 'Cocina' : 'Vendedor'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // View: PIN Pad
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="z-10 bg-surface shadow-neu rounded-[40px] border border-white/5 p-10 w-full max-w-md flex flex-col items-center relative">
        <button 
          onClick={() => setSelectedUser(null)}
          className="absolute top-6 left-6 p-3 rounded-full hover:bg-white/5 text-foreground-muted transition-colors active-scale"
        >
          <X className="w-6 h-6" />
        </button>

        <div className={cn("w-24 h-24 rounded-full flex items-center justify-center shadow-neu-inset text-white text-3xl font-black mb-4", selectedUser.color || "bg-primary")}>
          {selectedUser.name.charAt(0)}
        </div>
        <h2 className="text-xl font-black text-foreground">{selectedUser.name}</h2>
        <p className="text-[11px] uppercase font-bold text-foreground-subtle tracking-widest mb-8">Ingresa tu PIN</p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={cn(
                "w-6 h-6 rounded-full shadow-neu-inset border border-white/5 transition-all duration-300",
                pin.length > i ? "bg-primary shadow-neu-glow-primary" : "bg-transparent"
              )}
            />
          ))}
        </div>

        {error && (
          <p className="text-danger font-bold text-sm mb-4 animate-shake">{error}</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handlePinInput(num.toString())}
              className="h-16 rounded-[24px] bg-surface shadow-neu border border-white/5 text-2xl font-black text-foreground active-scale transition-all hover:text-primary"
            >
              {num}
            </button>
          ))}
          <div className="h-16" /> {/* Empty spot */}
          <button
            onClick={() => handlePinInput("0")}
            className="h-16 rounded-[24px] bg-surface shadow-neu border border-white/5 text-2xl font-black text-foreground active-scale transition-all hover:text-primary"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-16 rounded-[24px] bg-surface shadow-neu border border-white/5 flex items-center justify-center text-foreground-muted active-scale transition-all hover:text-danger"
          >
            <Delete className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
