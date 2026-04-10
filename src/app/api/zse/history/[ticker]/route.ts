import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ZSEApiResponse, HistoryPoint } from "@/lib/types";

const ZSE_API_TOKEN = "Bvt9fe2peQ7pwpyYqODM";

// Cache full price-list responses by date
const dateCache: Map<string, { securities: ZSEApiResponse["securities"]; timestamp: number }> = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getBusinessDays(count: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  const current = new Date(now);

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const days = getBusinessDays(30);

  const results: HistoryPoint[] = [];

  // Fetch in batches of 10 to avoid overwhelming the API
  for (let i = 0; i < days.length; i += 10) {
    const batch = days.slice(i, i + 10);
    const batchResults = await Promise.all(batch.map(fetchDateData));

    batchResults.forEach((securities, idx) => {
      const security = securities.find((s) => s.symbol === ticker);
      if (security && security.close_price) {
        results.push({
          date: batch[idx],
          close: parseFloat(security.close_price),
          high: security.high_price ? parseFloat(security.high_price) : parseFloat(security.close_price),
          low: security.low_price ? parseFloat(security.low_price) : parseFloat(security.close_price),
          volume: parseFloat(security.volume),
          turnover: parseFloat(security.turnover),
        });
      }
    });
  }

  // Sort by date ascending
  results.sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({ ticker, history: results });
}
