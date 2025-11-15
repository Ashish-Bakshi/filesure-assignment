"use client";

import { create } from "zustand";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type ToastStore = {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: number) => void;
};

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "info") =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: Date.now(), message, type }
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
