import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "./Button";

export default function Modal({ isOpen, onClose, title, children, className }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={cn(
          "bg-surface w-full max-w-md rounded-2xl shadow-neu-lg border-2 border-border-divider/10 overflow-hidden flex flex-col",
          "animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-divider/20 bg-surface shadow-sm">
          <h2 className="text-lg font-black text-foreground tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-lowest text-foreground-muted hover:text-danger transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
