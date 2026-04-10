"use client";

import { RefreshCw, LogIn, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  lastUpdated: string | null;
  onRefresh: () => void;
  loading: boolean;
}

export default function Header({ lastUpdated, onRefresh, loading }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("hr-HR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  const shortEmail = user?.email
    ? user.email.length > 20
      ? user.email.slice(0, 18) + "…"
      : user.email
    : null;

  return (
    <header
      className="px-6 py-4 flex items-center justify-between border-b border-[#2d2550] relative z-20"
      style={{
        background: "linear-gradient(135deg, #1e1e2f 0%, #2d2550 60%, #1a1a3e 100%)",
      }}
    >
      <div className="flex items-center gap-4">
        <Link href="/">
          <h1
            className="text-2xl font-bold tracking-wider cursor-pointer"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span
              style={{
                background: "linear-gradient(90deg, #a393f5, #6b5ce7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DION
            </span>
            <span className="text-white">ICA</span>
          </h1>
        </Link>
        <span className="text-xs text-[#6e6a8a] hidden sm:inline font-mono">
          Zagreb Stock Exchange
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Live clock */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ea371] animate-pulse" />
          <span className="text-xs text-[#6e6a8a] font-mono">{formattedTime}</span>
        </div>

        {/* Refresh */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRefresh}
          className="p-2 border border-[#3d3560] rounded-lg hover:border-[#6b5ce7] hover:bg-[#6b5ce7]/10 transition-all"
          title="Osvježi podatke"
        >
          <RefreshCw
            size={16}
            className={`text-[#a393f5] ${loading ? "animate-spin" : ""}`}
          />
        </motion.button>

        {/* Auth */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#3d3560] rounded-lg hover:border-[#6b5ce7] hover:bg-[#6b5ce7]/10 transition-all"
            >
              <User size={14} className="text-[#a393f5]" />
              <span className="text-xs text-[#a393f5] font-mono hidden sm:inline">
                {shortEmail}
              </span>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#3d3560] overflow-hidden shadow-xl"
                  style={{ background: "#1e1e2f" }}
                >
                  <div className="px-4 py-3 border-b border-[#3d3560]">
                    <p className="text-xs text-[#6e6a8a]">Prijavljeni kao</p>
                    <p className="text-xs text-white font-mono truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#e04363] hover:bg-[#e04363]/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Odjava
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link href="/auth">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(90deg, #6b5ce7, #a393f5)" }}
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Prijava</span>
            </motion.button>
          </Link>
        )}
      </div>
    </header>
  );
}
