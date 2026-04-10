"use client";

import { Stock } from "@/lib/types";
import { formatPrice, formatTurnover, changeColor } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface VolumeLeaderProps {
  stock: Stock;
  maxTurnover: number;
  index: number;
}

export default function VolumeLeader({
  stock,
  maxTurnover,
  index,
}: VolumeLeaderProps) {
  const turnoverPercent = (stock.turnover / maxTurnover) * 100;

  return (
    <Link href={`/stock/${stock.ticker}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.08 }}
        className="min-w-[220px] border border-[#e8e5f2] bg-white rounded-xl p-4 hover:shadow-md hover:border-[#6b5ce7]/30 transition-all flex-shrink-0 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#1e1e2f]">
            {stock.ticker}
          </span>
          <span className={`font-mono text-sm font-bold ${changeColor(stock.change)}`}>
            {stock.change >= 0 ? "+" : ""}
            {stock.change.toFixed(2)}%
          </span>
        </div>
        <p className="text-xs text-[#8b8fa3] truncate mb-3">{stock.name}</p>
        <div className="mb-2">
          <div className="w-full h-1.5 bg-[#f1eff8] rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${turnoverPercent}%` }}
              transition={{ delay: index * 0.08 + 0.3, duration: 0.5 }}
              className={`h-full rounded-full ${stock.change >= 0 ? "bg-[#0ea371]" : "bg-[#e04363]"}`}
            />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="font-mono text-lg text-[#1e1e2f] font-bold">
            {formatPrice(stock.lastPrice)} €
          </span>
          <span className="font-mono text-xs text-[#8b8fa3]">
            {formatTurnover(stock.turnover)}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
