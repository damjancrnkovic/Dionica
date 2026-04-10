"use client";

import { useState } from "react";
import { useStocks } from "@/hooks/useStocks";
import { useWatchlist } from "@/hooks/useWatchlist";
import Header from "@/components/Header";
import StockList from "@/components/StockList";
import StockCard from "@/components/StockCard";
import VolumeTable from "@/components/VolumeTable";
import MarketTable from "@/components/MarketTable";
import CrobexChart from "@/components/CrobexChart";
import { motion, AnimatePresence } from "framer-motion";
import { PanelRightClose, PanelRightOpen, BarChart2, TrendingUp, AlertTriangle } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="border border-[#e8e5f2] bg-white rounded-xl p-4">
      <div className="skeleton h-4 w-24 mb-2" />
      <div className="skeleton h-3 w-32 mb-4" />
      <div className="skeleton h-10 w-full mb-3" />
      <div className="skeleton h-6 w-20" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton h-8 w-full" />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data, loading, error, refetch } = useStocks();
  const { watchlist, toggle, isPinned } = useWatchlist();
  const [tableOpen, setTableOpen] = useState(true);

  const pinnedStocks =
    data?.stocks.filter((s) => watchlist.includes(s.ticker)) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        lastUpdated={data?.lastUpdated ?? null}
        onRefresh={refetch}
        loading={loading}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar — Stock List */}
        <aside className="hidden md:flex flex-col w-64 border-r border-[#e8e5f2] bg-[#f1eff8] p-3 overflow-hidden">
          <h2
            className="text-xs text-[#8b8fa3] uppercase tracking-widest mb-3 font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Sve dionice
          </h2>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton h-8 w-full" />
              ))}
            </div>
          ) : data ? (
            <StockList
              stocks={data.stocks}
              onTogglePin={toggle}
              isPinned={isPinned}
            />
          ) : null}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-[#e04363] border border-[#e04363]/20 bg-[#e04363]/5 px-4 py-3 rounded-lg">
              <AlertTriangle size={16} />
              <span>Podaci privremeno nedostupni — prikazani su zadnji dostupni podaci</span>
            </div>
          )}

          {/* CBX Index + Top Volume — side by side on wider screens */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* CBX Chart */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 size={15} className="text-[#6b5ce7]" />
                <h2
                  className="text-xs uppercase tracking-widest text-[#8b8fa3] font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  CBX Indeks
                </h2>
              </div>
              <CrobexChart />
            </div>

            {/* Top Volume Table */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={15} className="text-[#6b5ce7]" />
                <h2
                  className="text-xs uppercase tracking-widest text-[#8b8fa3] font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Najveći promet danas
                </h2>
              </div>
              {loading ? (
                <div className="rounded-xl border border-[#e8e5f2] bg-white p-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton h-10 w-full" />
                  ))}
                </div>
              ) : data ? (
                <VolumeTable stocks={data.topTurnover} />
              ) : null}
            </div>
          </div>

          {/* Pinned / Watchlist Cards */}
          <section>
            <h2
              className="text-xs uppercase tracking-widest text-[#8b8fa3] font-bold mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {pinnedStocks.length > 0 ? "Watchlista" : "Odaberite dionice iz lijeve liste"}
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : pinnedStocks.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
              >
                <AnimatePresence>
                  {pinnedStocks.map((stock, i) => (
                    <StockCard
                      key={stock.ticker}
                      stock={stock}
                      isPinned={true}
                      onTogglePin={toggle}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="border border-dashed border-[#e8e5f2] rounded-xl p-8 text-center">
                <p className="text-[#8b8fa3] text-sm">
                  Kliknite na dionicu u lijevoj listi da je dodate u watchlistu
                </p>
              </div>
            )}
          </section>

          {/* Market Table (collapsible) — hidden on mobile */}
          <section className="hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xs uppercase tracking-widest text-[#8b8fa3] font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Tržišna tablica
              </h2>
              <button
                onClick={() => setTableOpen(!tableOpen)}
                className="p-2 text-[#8b8fa3] hover:text-[#1e1e2f] transition-colors"
                title={tableOpen ? "Sakrij tablicu" : "Prikaži tablicu"}
              >
                {tableOpen ? (
                  <PanelRightClose size={16} />
                ) : (
                  <PanelRightOpen size={16} />
                )}
              </button>
            </div>
            <AnimatePresence>
              {tableOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border border-[#e8e5f2] bg-white rounded-xl"
                >
                  {loading ? (
                    <div className="p-4">
                      <SkeletonTable />
                    </div>
                  ) : data ? (
                    <MarketTable stocks={data.stocks} />
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
    </div>
  );
}
