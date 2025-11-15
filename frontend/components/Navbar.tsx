"use client";

import { logout } from "@/lib/logout";
import { useAuth } from "@/store/useAuth";
import { useToast } from "@/store/useToast";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const setUser = useAuth((s) => s.setUser);
  const router = useRouter();
  const addToast = useToast((s) => s.addToast);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      addToast("Logged out!", "success");
      router.push("/login");
    } catch {
      addToast("Logout failed", "error");
    }
  };

  return (
    <nav className="w-full border-b bg-white px-6 py-4 shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex justify-between items-center">

        <h1
          className="text-xl font-semibold cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          FileSure Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}
