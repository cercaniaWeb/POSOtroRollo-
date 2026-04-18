import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
            className="glass-surface bg-white/80 shadow-ambient border border-white/40 rounded-2xl p-4 min-w-[320px] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              {toast.variant === 'success' ? (
                <CheckCircle className="text-emerald-500" size={24} />
              ) : (
                <AlertCircle className="text-red-500" size={24} />
              )}
              <span className="font-semibold text-sidebar-navy">{toast.message}</span>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-brand hover:text-sidebar-navy transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastBox;
