import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  referralCode: string;
} | null;

interface AuthStore {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => set({ user: null })
}));
