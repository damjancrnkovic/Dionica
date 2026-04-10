"use client";

import { useEffect, useState, use } from "react";
import { Stock, HistoryPoint } from "@/lib/types";
import {
  formatPrice,
  formatVolume,
  formatTurnover,
  formatChange,
  changeColor,
  changeBg,
} from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface StockPageProps {
  params: Promise<{ ticker: string }>;
}

export default function StockPage({ params }: StockPageProps) {
  const { ticker } = use(params);
  const [stock, setStock] = useState<Stock | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    // Fetch current stock data
    fetch("/api/zse")
      .then((r) => r.json())
      .then((data) => {
        const found = data.stocks.find((s: Stock) => s.ticker === ticker);
        setStock(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch history
    fetch(`/api/zse/history/${encodeURIComponent(ticker)}`)
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history || []);
        setHistoryLoading(false);
      })
      .catch(() => setHistoryLoading(false));
  }, [ticker]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7fc] p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-6 w-72" />
          <div className="skeleton h-[400px] w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-[#f8f7fc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8b8fa3] text-lg mb-4">
            Dionica <span className="text-[#1e1e2f] font-bold">{ticker}</span> nije pronađena
          </p>
          <Link
            href="/"
            className="text-[#6b5ce7] hover:underline text-sm"
          >
            ← Povratak na dashboard
          </Link>
        </div>
      </div>
    );
  }

  const TrendIcon =
    stock.change > 0 ? TrendingUp : stock.change < 0 ? TrendingDown : Minus;

  const priceMin = history.length
    ? Math.min(...history.map((h) => h.low)) * 0.995
    : 0;
  const priceMax = history.length
    ? Math.max(...history.map((h) => h.high)) * 1.005
    : 0;

  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {/* Header bar */}
      <div className="border-b border-[#e8e5f2] bg-white px-4 md:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="p-2 text-[#8b8fa3] hover:text-[#6b5ce7] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <h1
              className="text-2xl font-bold text-[#1e1e2f]"
            >
              {stock.ticker}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-mono font-bold border rounded ${changeBg(stock.change)} ${changeColor(stock.change)}`}
            >
              <TrendIcon size={14} />
              {formatChange(stock.change)}
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-mono text-2xl font-bold text-[#1e1e2f]">
              {formatPrice(stock.lastPrice)} <span className="text-sm text-[#8b8fa3]">€</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Stock name */}
        <div>
          <p className="text-[#8b8fa3] text-sm">{stock.name}</p>
          {stock.isin && (
            <p className="text-[#8b8fa3]/60 text-xs font-mono mt-1">
              ISIN: {stock.isin} · Segment: {stock.segment}
            </p>
          )}
        </div>

        {/* Mobile price */}
        <div className="sm:hidden">
          <p className="font-mono text-3xl font-bold text-[#1e1e2f]">
            {formatPrice(stock.lastPrice)} <span className="text-lg text-[#8b8fa3]">€</span>
          </p>
        </div>

        {/* Price Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#e8e5f2] bg-white rounded-xl p-5"
        >
          <h2
            className="text-xs uppercase tracking-widest text-[#8b8fa3] font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Kretanje cijene — zadnjih 30 radnih dana
          </h2>
          {historyLoading ? (
            <div className="skeleton h-[350px] w-full" />
          ) : history.length > 1 ? (
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={stock.change >= 0 ? "#0ea371" : "#e04363"}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={stock.change >= 0 ? "#0ea371" : "#e04363"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e8e5f2"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#8b8fa3", fontSize: 11 }}
                    tickFormatter={(d: string) => {
                      const parts = d.split("-");
                      return `${parts[2]}.${parts[1]}.`;
                    }}
                    axisLine={{ stroke: "#e8e5f2" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[priceMin, priceMax]}
                    tick={{ fill: "#8b8fa3", fontSize: 11 }}
                    tickFormatter={(v: number) => formatPrice(v)}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e8e5f2",
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    labelStyle={{ color: "#8b8fa3" }}
                    labelFormatter={(d) => {
                      const parts = String(d).split("-");
                      return `${parts[2]}.${parts[1]}.${parts[0]}.`;
                    }}
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        close: "Zatvaranje",
                        high: "Najviša",
                        low: "Najniža",
                      };
                      return [`${formatPrice(Number(value))} €`, labels[String(name)] || String(name)];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={stock.change >= 0 ? "#0ea371" : "#e04363"}
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: stock.change >= 0 ? "#0ea371" : "#e04363",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="#c5c0d8"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="#c5c0d8"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-[#8b8fa3] text-sm">
              Nema dovoljno podataka za prikaz grafa
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <StatCard label="Zadnja cijena" value={`${formatPrice(stock.lastPrice)} €`} />
          <StatCard
            label="Promjena"
            value={formatChange(stock.change)}
            color={changeColor(stock.change)}
          />
          <StatCard label="Najviša danas" value={`${formatPrice(stock.high)} €`} />
          <StatCard label="Najniža danas" value={`${formatPrice(stock.low)} €`} />
          <StatCard label="Volumen" value={formatVolume(stock.volume)} />
          <StatCard label="Promet" value={formatTurnover(stock.turnover)} />
          <StatCard label="Segment" value={stock.segment} mono={false} />
          <StatCard label="Tip" value={stock.securityType} mono={false} />
        </motion.div>

        {/* History Table */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-[#e8e5f2] bg-white rounded-xl"
          >
            <h2
              className="text-xs uppercase tracking-widest text-[#8b8fa3] font-bold px-4 py-3 border-b border-[#e8e5f2]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Povijesni podaci
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e5f2]">
                    <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2 text-left">
                      Datum
                    </th>
                    <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2 text-right">
                      Cijena
                    </th>
                    <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2 text-right">
                      High
                    </th>
                    <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2 text-right">
                      Low
                    </th>
                    <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2 text-right">
                      Volumen
                    </th>
                    <th className="text-xs text-[#8b8fa3] font-medium px-3 py-2 text-right">
                      Promet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map((point) => (
                    <tr
                      key={point.date}
                      className="border-b border-[#f1eff8] hover:bg-[#f3f1fa]"
                    >
                      <td className="font-mono text-xs text-[#1e1e2f] px-3 py-2">
                        {point.date.split("-").reverse().join(".")}
                      </td>
                      <td className="font-mono text-xs text-[#1e1e2f] text-right px-3 py-2">
                        {formatPrice(point.close)}
                      </td>
                      <td className="font-mono text-xs text-[#8b8fa3] text-right px-3 py-2">
                        {formatPrice(point.high)}
                      </td>
                      <td className="font-mono text-xs text-[#8b8fa3] text-right px-3 py-2">
                        {formatPrice(point.low)}
                      </td>
                      <td className="font-mono text-xs text-[#1e1e2f] text-right px-3 py-2">
                        {formatVolume(point.volume)}
                      </td>
                      <td className="font-mono text-xs text-[#8b8fa3] text-right px-3 py-2">
                        {formatTurnover(point.turnover)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  mono = true,
}: {
  label: string;
  value: string;
  color?: string;
  mono?: boolean;
}) {
  return (
    <div className="border border-[#e8e5f2] bg-white rounded-xl p-4">
      <p className="text-xs text-[#8b8fa3] uppercase tracking-wider mb-2">
        {label}
      </p>
      <p
        className={`text-lg font-bold ${color || "text-[#1e1e2f]"} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
