"use client";

import { useState, useEffect, useCallback } from "react";
import { StockData } from "@/lib/types";

export function useStocks() {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/zse");
      if (!res.ok) throw new Error("Failed to fetch");
      const json: StockData = await res.json();
      setData(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Podaci privremeno nedostupni"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchStocks]);

  return { data, loading, error, refetch: fetchStocks };
}
