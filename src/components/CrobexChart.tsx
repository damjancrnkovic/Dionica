"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface CrobexPoint {
  date: string;
  value: number;
  change: number;
}

export default function CrobexChart() {
  const [data, setData] = useState<CrobexPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/zse/crobex")
      .then((r) => r.json())
      .then((d: CrobexPoint[]) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = data[data.length - 1] ?? null;
  const todayChange = today?.change ?? 0;
  const todayValue = today?.value ?? null;
  const isPositive = todayChange >= 0;
  const color = todayChange > 0 ? "#0ea371" : todayChange < 0 ? "#e04363" : "#8b8fa3";

  const TrendIcon = todayChange > 0 ? TrendingUp : todayChange < 0 ? TrendingDown : Minus;

  const minVal = data.length ? Math.min(...data.map((d) => d.value)) * 0.998 : 950;
  const maxVal = data.length ? Math.max(...data.map((d) => d.value)) * 1.002 : 1050;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden border border-[#e8e5f2]"
      style={{
        background: "linear-gradient(135deg, #1e1e2f 0%, #2d2550 60%, #1a1a3e 100%)",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-[#a393f5]" />
            <span className="text-xs uppercase tracking-widest text-[#a393f5] font-bold">
              CBX Indeks
            </span>
          </div>
          <p className="text-[10px] text-[#6e6a8a]">
            Sintetički indeks · zadnjih 30 radnih dana
          </p>
        </div>

        {/* Today badge */}
        {todayValue !== null && !loading && (
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-white">
              {todayValue.toLocaleString("hr-HR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold font-mono mt-1"
              style={{
                background: isPositive ? "rgba(14,163,113,0.2)" : "rgba(224,67,99,0.2)",
                color,
                border: `1px solid ${color}40`,
              }}
            >
              <TrendIcon size={11} />
              {todayChange >= 0 ? "+" : ""}
              {todayChange.toFixed(2)}% danas
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="px-1 pb-4">
        {loading ? (
          <div className="h-[280px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#6b5ce7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.length > 1 ? (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="cbxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6e6a8a", fontSize: 10 }}
                  tickFormatter={(d: string) => {
                    const parts = d.split("-");
                    return `${parts[2]}.${parts[1]}.`;
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[minVal, maxVal]}
                  tick={{ fill: "#6e6a8a", fontSize: 10 }}
                  tickFormatter={(v: number) => v.toFixed(0)}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e2f",
                    border: "1px solid #3d3560",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#a393f5", marginBottom: 4 }}
                  labelFormatter={(d) => {
                    const parts = String(d).split("-");
                    return `${parts[2]}.${parts[1]}.${parts[0]}.`;
                  }}
                  formatter={(value, name) => {
                    if (name === "value") return [`${Number(value).toFixed(2)}`, "CBX"];
                    if (name === "change") return [`${Number(value) >= 0 ? "+" : ""}${Number(value).toFixed(2)}%`, "Promjena"];
                    return [String(value), String(name)];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill="url(#cbxGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: color, stroke: "#1e1e2f", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-[#6e6a8a] text-sm">
            Nema dovoljno podataka
          </div>
        )}
      </div>
    </motion.div>
  );
}
