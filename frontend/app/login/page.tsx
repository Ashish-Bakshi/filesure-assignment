"use client";

import { useState } from "react";
import { API } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/store/useToast";

export default function LoginPage() {
  const router = useRouter();
  const addToast = useToast((s) => s.addToast);
  const setUser = useAuth((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const res = await API.post("/auth/login", { email, password });

      setUser(res.data);
      addToast("Login successful!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      addToast(err?.message || "Login failed", "error");
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow p-6 rounded-xl w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?
          <a href="/register" className="text-blue-600"> Register</a>
        </p>
      </div>
    </div>
  );
}
