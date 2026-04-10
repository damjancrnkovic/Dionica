"use client";

import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  lastUpdated: string | null;
  onRefresh: () => void;
  loading: boolean;
}

export default function Header({ lastUpdated, onRefresh, loading }: HeaderProps) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("hr-HR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  return (
    <header className="border-b border-[#e8e5f2] bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
          <span className="text-[#6b5ce7]">DION</span>
          <span className="text-[#1e1e2f]">ICA</span>
        </h1>
        <span className="text-xs text-[#8b8fa3] hidden sm:inline">
          Zagreb Stock Exchange
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-[#8b8fa3] font-mono">
          {formattedTime}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRefresh}
          className="p-2 border border-[#e8e5f2] rounded-lg hover:border-[#6b5ce7]/40 hover:shadow-sm transition-all"
          title="Osvježi podatke"
        >
          <RefreshCw
            size={16}
            className={`text-[#8b8fa3] ${loading ? "animate-spin" : ""}`}
          />
        </motion.button>
      </div>
    </header>
  );
}
