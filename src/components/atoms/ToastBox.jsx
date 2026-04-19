import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const ToastBox = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-8 right-8 z-[100] space-y-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="bg-surface shadow-neu border border-white/10 rounded-[28px] p-6 min-w-[360px] flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shadow-neu-inset",
                toast.variant === 'success' ? 'bg-success/10' : 'bg-danger/10'
              )}>
                {toast.variant === 'success' ? (
                  <CheckCircle className="text-success" size={24} />
                ) : (
                  <AlertCircle className="text-danger" size={24} />
                )}
              </div>
              <span className="font-black text-[13px] text-foreground uppercase tracking-tight">{toast.message}</span>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-foreground-subtle hover:text-danger transition-colors p-2 active-scale"
            >
              <X size={20} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastBox;
