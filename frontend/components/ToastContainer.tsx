"use client";

import { useToast } from "@/store/useToast";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(
      () => removeToast(toasts[0].id),
      3000
    );

    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed top-5 right-5 space-y-3 z-99999 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.25 }}
            className={`
          px-4 py-3 rounded-xl shadow text-white text-sm 
          ${toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                  ? "bg-red-600"
                  : "bg-gray-900"
              }
        `}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
