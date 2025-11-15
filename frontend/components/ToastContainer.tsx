"use client";

import { useToast } from "@/store/useToast";
import { useEffect } from "react";

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
    <div className="fixed top-5 right-5 space-y-3 z-[99999]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-xl shadow text-white text-sm 
            transition-all duration-300
            ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-gray-900"
            }
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
