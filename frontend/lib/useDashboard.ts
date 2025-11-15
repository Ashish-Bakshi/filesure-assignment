"use client";

import { useState, useEffect } from "react";
import { API } from "@/lib/api";

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await API.get("/dashboard");
      setDashboard(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { loading, dashboard, error };
}
