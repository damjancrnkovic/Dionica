"use client";

import { Stock } from "@/lib/types";
import { formatPrice, formatTurnover, formatChange } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VolumeTableProps {
  stocks: Stock[];
}

export default function VolumeTable({ stocks }: VolumeTableProps) {
  return (
    <div className="rounded-xl border border-[#e8e5f2] bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e8e5f2] bg-[#f8f7fc]">
            <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2.5 text-left w-8">#</th>
            <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2.5 text-left">Ticker</th>
            <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2.5 text-right">Cijena</th>
            <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2.5 text-right">Promjena</th>
            <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2.5 text-right hidden md:table-cell">Promet</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, i) => {
            const isPos = stock.change > 0;
            const isNeg = stock.change < 0;
            const Icon = isPos ? TrendingUp : isNeg ? TrendingDown : Minus;
            const borderColor = isPos ? "#0ea371" : isNeg ? "#e04363" : "#e8e5f2";
            const maxTurnover = stocks[0]?.turnover ?? 1;
            const barWidth = (stock.turnover / maxTurnover) * 100;

            return (
              <motion.tr
                key={stock.ticker}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-[#f1eff8] hover:bg-[#f3f1fa] transition-colors cursor-pointer relative"
                style={{ borderLeft: `3px solid ${borderColor}` }}
              >
                <td className="px-3 py-2.5">
                  <span className="text-xs font-bold text-[#c5c0d8]">{i + 1}</span>
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/stock/${stock.ticker}`} className="block">
                    <span className="text-sm font-bold text-[#1e1e2f] hover:text-[#6b5ce7] transition-colors">
                      {stock.ticker}
                    </span>
                    {/* Promet bar */}
                    <div className="mt-1 h-1 bg-[#f1eff8] rounded-full w-16">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${barWidth}%`,
                          background: isPos ? "#0ea371" : isNeg ? "#e04363" : "#8b8fa3",
                        }}
                      />
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Link href={`/stock/${stock.ticker}`}>
                    <span className="font-mono text-sm font-semibold text-[#1e1e2f]">
                      {formatPrice(stock.lastPrice)}
                    </span>
                    <span className="text-[10px] text-[#8b8fa3] ml-0.5">€</span>
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Link href={`/stock/${stock.ticker}`}>
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                        isPos
                          ? "bg-[#0ea371]/10 text-[#0ea371]"
                          : isNeg
                          ? "bg-[#e04363]/10 text-[#e04363]"
                          : "bg-[#8b8fa3]/10 text-[#8b8fa3]"
                      }`}
                    >
                      <Icon size={10} />
                      {formatChange(stock.change)}
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-right hidden md:table-cell">
                  <Link href={`/stock/${stock.ticker}`}>
                    <span className="font-mono text-xs text-[#8b8fa3]">
                      {formatTurnover(stock.turnover)}
                    </span>
                  </Link>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
