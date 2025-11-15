"use client";

import { useState } from "react";
import { API } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const search = useSearchParams();

  const setUser = useAuth((state) => state.setUser);

  const referralFromURL = search.get("referrerCode") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referrerCode, setReferrerCode] = useState(referralFromURL);

  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setError("");

      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        referrerCode,
      });

      setUser(res.data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow p-6 rounded-xl w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">Register</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <input
          type="text"
          placeholder="Referral Code (optional)"
          className="w-full border p-2 rounded"
          value={referrerCode}
          onChange={(e) => setReferrerCode(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white p-2 rounded"
        >
          Register
        </button>

        <p className="text-sm text-center">
          Already have an account?
          <a href="/login" className="text-blue-600"> Login</a>
        </p>
      </div>
    </div>
  );
}
