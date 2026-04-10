"use client";

import { Stock } from "@/lib/types";
import { formatPrice, formatVolume } from "@/lib/utils";
import PriceChange from "./PriceChange";
import Sparkline from "./Sparkline";
import { motion } from "framer-motion";
import { Pin } from "lucide-react";
import Link from "next/link";

interface StockCardProps {
  stock: Stock;
  isPinned: boolean;
  onTogglePin: (ticker: string) => void;
  index: number;
}

export default function StockCard({
  stock,
  isPinned,
  onTogglePin,
  index,
}: StockCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-[#e8e5f2] bg-white rounded-xl hover:shadow-md hover:border-[#6b5ce7]/30 transition-all group"
    >
      <div className="flex items-start justify-between p-4 pb-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#1e1e2f] font-semibold">
              {stock.ticker}
            </span>
            <PriceChange change={stock.change} size="sm" />
          </div>
          <p className="text-xs text-[#8b8fa3] mt-1 truncate max-w-[160px]">
            {stock.name}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin(stock.ticker);
          }}
          className={`p-1 transition-colors ${
            isPinned
              ? "text-[#6b5ce7]"
              : "text-[#8b8fa3] opacity-0 group-hover:opacity-100"
          }`}
          title={isPinned ? "Ukloni iz watchliste" : "Dodaj u watchlistu"}
        >
          <Pin size={14} />
        </button>
      </div>

      <Link href={`/stock/${stock.ticker}`} className="block p-4 pt-3">
        <Sparkline price={stock.lastPrice} change={stock.change} />

        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="font-mono text-xl text-[#1e1e2f] font-bold">
              {formatPrice(stock.lastPrice)}
            </span>
            <span className="text-xs text-[#8b8fa3] ml-1">€</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#8b8fa3] font-mono">
              Vol: {formatVolume(stock.volume)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
