"use client";

import { useState } from "react";
import { Stock } from "@/lib/types";
import { changeColor } from "@/lib/utils";
import { Search, Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface StockListProps {
  stocks: Stock[];
  onTogglePin: (ticker: string) => void;
  isPinned: (ticker: string) => boolean;
}

export default function StockList({
  stocks,
  onTogglePin,
  isPinned,
}: StockListProps) {
  const [search, setSearch] = useState("");

  const filtered = stocks.filter(
    (s) =>
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-3">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8fa3]"
        />
        <input
          type="text"
          placeholder="Pretraži dionice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e8e5f2] text-sm text-[#1e1e2f] pl-9 pr-3 py-2 rounded-lg placeholder:text-[#b8b8c8] focus:outline-none focus:border-[#6b5ce7]/40 focus:ring-1 focus:ring-[#6b5ce7]/20"
        />
      </div>
      <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-thin">
        <AnimatePresence>
          {filtered.map((stock) => (
            <motion.div
              key={stock.ticker}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between hover:bg-[#f3f1fa] transition-all group rounded-lg border border-transparent hover:border-[#e8e5f2]"
            >
              <Link
                href={`/stock/${stock.ticker}`}
                className="flex-1 flex items-center gap-2 min-w-0 px-3 py-2"
              >
                <span className="text-xs text-[#1e1e2f] font-semibold truncate">
                  {stock.ticker}
                </span>
                <span
                  className={`font-mono text-xs font-bold flex-shrink-0 ml-auto ${changeColor(stock.change)}`}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </span>
              </Link>
              <button
                onClick={() => onTogglePin(stock.ticker)}
                className={`p-2 flex-shrink-0 ${
                  isPinned(stock.ticker)
                    ? "text-[#6b5ce7]"
                    : "text-transparent group-hover:text-[#8b8fa3]"
                } transition-colors`}
                title={isPinned(stock.ticker) ? "Ukloni iz watchliste" : "Dodaj u watchlistu"}
              >
                <Pin size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
