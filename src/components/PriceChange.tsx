"use client";

import { formatChange, changeColor } from "@/lib/utils";
import { motion } from "framer-motion";

interface PriceChangeProps {
  change: number;
  size?: "sm" | "md" | "lg";
}

export default function PriceChange({ change, size = "md" }: PriceChangeProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const bgClass =
    change > 0
      ? "bg-[#0ea371]/10 border-[#0ea371]/25"
      : change < 0
        ? "bg-[#e04363]/10 border-[#e04363]/25"
        : "bg-[#8b8fa3]/10 border-[#8b8fa3]/25";

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-mono border rounded ${bgClass} ${changeColor(change)} ${sizeClasses[size]}`}
    >
      {formatChange(change)}
    </motion.span>
  );
}
