"use client";

import { useState } from "react";
import { Stock } from "@/lib/types";
import {
  formatPrice,
  formatVolume,
  formatTurnover,
  changeColor,
  formatChange,
} from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface MarketTableProps {
  stocks: Stock[];
}

type SortKey = keyof Stock;
type SortDir = "asc" | "desc";

export default function MarketTable({ stocks }: MarketTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("turnover");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const router = useRouter();

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...stocks].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="inline ml-1" />
    ) : (
      <ChevronDown size={12} className="inline ml-1" />
    );
  };

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: "ticker", label: "Ticker" },
    { key: "name", label: "Naziv" },
    { key: "lastPrice", label: "Cijena", align: "text-right" },
    { key: "change", label: "Promjena", align: "text-right" },
    { key: "high", label: "High", align: "text-right" },
    { key: "low", label: "Low", align: "text-right" },
    { key: "volume", label: "Volumen", align: "text-right" },
    { key: "turnover", label: "Promet", align: "text-right" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e8e5f2]">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key)}
                className={`text-xs text-[#8b8fa3] font-medium px-3 py-2.5 cursor-pointer hover:text-[#1e1e2f] transition-colors select-none ${col.align || "text-left"}`}
              >
                {col.label}
                <SortIcon col={col.key} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((stock) => (
            <tr
              key={stock.ticker}
              onClick={() => router.push(`/stock/${stock.ticker}`)}
              className="border-b border-[#f1eff8] hover:bg-[#f3f1fa] transition-all cursor-pointer"
            >
              <td className="text-xs font-semibold text-[#1e1e2f] px-3 py-2.5">
                {stock.ticker}
              </td>
              <td className="text-xs text-[#8b8fa3] px-3 py-2.5 truncate max-w-[200px]">
                {stock.name}
              </td>
              <td className="font-mono text-xs text-[#1e1e2f] text-right px-3 py-2.5">
                {formatPrice(stock.lastPrice)}
              </td>
              <td
                className={`font-mono text-xs text-right px-3 py-2.5 font-bold ${changeColor(stock.change)}`}
              >
                {formatChange(stock.change)}
              </td>
              <td className="font-mono text-xs text-[#8b8fa3] text-right px-3 py-2.5">
                {formatPrice(stock.high)}
              </td>
              <td className="font-mono text-xs text-[#8b8fa3] text-right px-3 py-2.5">
                {formatPrice(stock.low)}
              </td>
              <td className="font-mono text-xs text-[#1e1e2f] text-right px-3 py-2.5">
                {formatVolume(stock.volume)}
              </td>
              <td className="font-mono text-xs text-[#8b8fa3] text-right px-3 py-2.5">
                {formatTurnover(stock.turnover)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
