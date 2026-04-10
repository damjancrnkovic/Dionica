"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "dionica-watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    async function loadWatchlist(uid: string | null) {
      if (!isMounted) return;
      if (uid) {
        const { data } = await supabase
          .from("watchlists")
          .select("ticker")
          .eq("user_id", uid);
        if (isMounted && data) {
          setWatchlist(data.map((r: { ticker: string }) => r.ticker));
        }
      } else {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (isMounted && stored) setWatchlist(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      if (isMounted) setUserId(uid);
      loadWatchlist(uid);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const uid = session?.user?.id ?? null;
      if (isMounted) setUserId(uid);
      loadWatchlist(uid);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const toggle = useCallback(
    async (ticker: string) => {
      const pinned = watchlist.includes(ticker);
      const next = pinned
        ? watchlist.filter((t) => t !== ticker)
        : [...watchlist, ticker];

      setWatchlist(next); // optimistic update

      if (userId) {
        if (pinned) {
          await supabase
            .from("watchlists")
            .delete()
            .eq("user_id", userId)
            .eq("ticker", ticker);
        } else {
          await supabase
            .from("watchlists")
            .insert({ user_id: userId, ticker });
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    },
    [watchlist, userId, supabase]
  );

  const isPinned = useCallback(
    (ticker: string) => watchlist.includes(ticker),
    [watchlist]
  );

  return { watchlist, toggle, isPinned };
}
