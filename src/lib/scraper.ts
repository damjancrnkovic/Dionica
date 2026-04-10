import axios from "axios";
import { Stock, ZSEApiResponse } from "./types";
import { mockStocks } from "./mockData";

const ZSE_API_TOKEN = "Bvt9fe2peQ7pwpyYqODM";

function getZSEApiUrl(): string {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  return `https://rest.zse.hr/web/${ZSE_API_TOKEN}/price-list/XZAG/${date}/json`;
}

// Map ticker symbols to company names
const COMPANY_NAMES: Record<string, string> = {
  ADPL: "AD Plastik d.d.",
  ARNT: "Arena Hospitality Group d.d.",
  ATGR: "Atlantic Grupa d.d.",
  HT: "HT d.d.",
  PODR: "Podravka d.d.",
  RIVP: "Valamar Riviera d.d.",
  KOEI: "Končar - Elektroindustrija d.d.",
  ERNT: "Ericsson Nikola Tesla d.d.",
  ZABA: "Zagrebačka banka d.d.",
  ADRS: "Adris grupa d.d.",
  ADRS2: "Adris grupa d.d. (povl.)",
  DLKV: "Dalekovod d.d.",
  SPAN: "Span d.d.",
  KRAS: "Kraš d.d.",
  MAIS: "Maistra d.d.",
  INA: "INA d.d.",
  HPB: "Hrvatska poštanska banka d.d.",
  IG: "Industrograd d.d.",
  INGR: "Ingra d.d.",
  JDPL: "Jadroplov d.d.",
  LKRI: "Luka Rijeka d.d.",
  MDKA: "Medika d.d.",
  CIAK: "Ciak grupa d.d.",
  CKML: "Čakovečki mlinovi d.d.",
  CROS: "Croatia osiguranje d.d.",
  CROS2: "Croatia osiguranje d.d. (povl.)",
  HEFA: "Hefa d.d.",
  IGH: "IGH d.d.",
  THNK: "Tehnika d.d.",
  VLEN: "Valenat d.d.",
  ZITO: "Žito d.d.",
  BSQR: "Bosqar d.d.",
  GRNL: "Granolio d.d.",
  SNBA: "Sunčani Hvar d.d.",
  MONP: "Moneta Pax d.d.",
  KODT: "Končar - Distributivni transformatori d.d.",
  KODT2: "Končar - Dist. transf. d.d. (povl.)",
  PLAG: "Plava laguna d.d.",
  LRH: "Liburnia Riviera Hoteli d.d.",
  LKPC: "Luka Ploče d.d.",
  JDOS: "Jadrolinija d.d.",
  CTKS: "Crosteel d.d.",
  LPLH: "Lipapromet d.d.",
  PDBA: "Podravska banka d.d.",
  TKPR: "Teknoplast d.d.",
  "7BET": "InterCapital CROBEX10tr UCITS ETF",
  "7CRO": "InterCapital CROBEX10 UCITS ETF",
  "7SLO": "InterCapital SBI TOP UCITS ETF",
  "7CASH": "InterCapital Euro MM UCITS ETF",
  "7GROM": "InterCapital Euro Govt Bond UCITS ETF",
};

export async function scrapeZSE(): Promise<Stock[]> {
  try {
    const url = getZSEApiUrl();
    const { data } = await axios.get<ZSEApiResponse>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      timeout: 15000,
    });

    if (!data?.securities?.length) {
      console.warn("ZSE API returned no securities, using mock data");
      return mockStocks;
    }

    const stocks: Stock[] = data.securities
      .filter((s) => {
        // Only include equities and ETFs with a close price
        return (
          (s.security_class === "EQTY" || s.security_class === "ETF") &&
          s.close_price !== null
        );
      })
      .map((s) => ({
        ticker: s.symbol,
        isin: s.isin,
        name: COMPANY_NAMES[s.symbol] || s.symbol,
        lastPrice: parseFloat(s.close_price!),
        change: s.change_percent !== null ? parseFloat(s.change_percent) : 0,
        volume: parseFloat(s.volume),
        turnover: parseFloat(s.turnover),
        high: s.high_price ? parseFloat(s.high_price) : parseFloat(s.close_price!),
        low: s.low_price ? parseFloat(s.low_price) : parseFloat(s.close_price!),
        segment: s.segment,
        securityType: s.security_type,
      }));

    if (stocks.length > 0) {
      return stocks;
    }

    console.warn("ZSE API returned no valid equities, using mock data");
    return mockStocks;
  } catch (error) {
    console.error("ZSE API fetch failed:", error);
    return mockStocks;
  }
}
