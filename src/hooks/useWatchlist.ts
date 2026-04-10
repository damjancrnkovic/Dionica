"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "dionica-watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const save = useCallback((list: string[]) => {
    setWatchlist(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const toggle = useCallback(
    (ticker: string) => {
      const next = watchlist.includes(ticker)
        ? watchlist.filter((t) => t !== ticker)
        : [...watchlist, ticker];
      save(next);
    },
    [watchlist, save]
  );

  const isPinned = useCallback(
    (ticker: string) => watchlist.includes(ticker),
    [watchlist]
  );

  return { watchlist, toggle, isPinned };
}
