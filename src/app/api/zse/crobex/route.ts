import { NextResponse } from "next/server";
import axios from "axios";
import { ZSEApiResponse } from "@/lib/types";

const ZSE_API_TOKEN = "Bvt9fe2peQ7pwpyYqODM";

// Main CROBEX constituent tickers
const CROBEX_CONSTITUENTS = [
  "ATGR", "HT", "KOEI", "ERNT", "ZABA", "ADRS2", "RIVP",
  "PODR", "ADPL", "SPAN", "CROS", "ARNT", "MAIS", "INA", "PLAG",
];

const dateCache: Map<string, { securities: ZSEApiResponse["securities"]; timestamp: number }> = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function getBusinessDays(count: number): string[] {
  const dates: string[] = [];
  const current = new Date();
  while (dates.length < count) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(current.toISOString().split("T")[0]);
    }
    current.setDate(current.getDate() - 1);
  }
  return dates;
}

async function fetchDateData(date: string): Promise<ZSEApiResponse["securities"]> {
  const cached = dateCache.get(date);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.securities;
  }
  try {
    const url = `https://rest.zse.hr/web/${ZSE_API_TOKEN}/price-list/XZAG/${date}/json`;
    const { data } = await axios.get<ZSEApiResponse>(url, {
      headers: { Accept: "application/json" },
      timeout: 10000,
    });
    if (data?.securities?.length) {
      dateCache.set(date, { securities: data.securities, timestamp: Date.now() });
      return data.securities;
    }
    return [];
  } catch {
    return [];
  }
}

export interface CrobexPoint {
  date: string;
  value: number;
  change: number;
}

let resultCache: { data: CrobexPoint[]; timestamp: number } | null = null;
const RESULT_CACHE_DURATION = 5 * 60 * 1000;

export async function GET() {
  if (resultCache && Date.now() - resultCache.timestamp < RESULT_CACHE_DURATION) {
    return NextResponse.json(resultCache.data);
  }

  const days = getBusinessDays(30);
  const dayDataMap = new Map<string, Map<string, number>>();

  for (let i = 0; i < days.length; i += 10) {
    const batch = days.slice(i, i + 10);
    const batchResults = await Promise.all(batch.map(fetchDateData));
    batchResults.forEach((securities, idx) => {
      const prices = new Map<string, number>();
      CROBEX_CONSTITUENTS.forEach((ticker) => {
        const sec = securities.find((s) => s.symbol === ticker);
        if (sec?.close_price) {
          prices.set(ticker, parseFloat(sec.close_price));
        }
      });
      // Only include days where at least 5 constituents have data
      if (prices.size >= 5) {
        dayDataMap.set(batch[idx], prices);
      }
    });
  }

  const sortedDates = [...dayDataMap.keys()].sort();

  if (sortedDates.length === 0) {
    return NextResponse.json([]);
  }

  const basePrices = dayDataMap.get(sortedDates[0])!;
  const baseAvg = [...basePrices.values()].reduce((a, b) => a + b, 0) / basePrices.size;

  const points: CrobexPoint[] = sortedDates.map((date, i) => {
    const prices = dayDataMap.get(date)!;
    const avg = [...prices.values()].reduce((a, b) => a + b, 0) / prices.size;
    const value = parseFloat(((avg / baseAvg) * 1000).toFixed(2));

    let change = 0;
    if (i > 0) {
      const prevPrices = dayDataMap.get(sortedDates[i - 1])!;
      const prevAvg = [...prevPrices.values()].reduce((a, b) => a + b, 0) / prevPrices.size;
      change = parseFloat((((avg - prevAvg) / prevAvg) * 100).toFixed(2));
    }

    return { date, value, change };
  });

  resultCache = { data: points, timestamp: Date.now() };
  return NextResponse.json(points);
}
