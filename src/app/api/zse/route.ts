import { NextResponse } from "next/server";
import { scrapeZSE } from "@/lib/scraper";
import { StockData } from "@/lib/types";

let cache: { data: StockData; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  const stocks = await scrapeZSE();

  const topTurnover = [...stocks]
    .sort((a, b) => b.turnover - a.turnover)
    .slice(0, 5);

  const result: StockData = {
    stocks,
    topTurnover,
    lastUpdated: new Date().toISOString(),
  };

  cache = { data: result, timestamp: now };

  return NextResponse.json(result);
}
