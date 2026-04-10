export function formatPrice(value: number): string {
  return value.toLocaleString("hr-HR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2).replace(".", ",") + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(".", ",") + "K";
  }
  return value.toLocaleString("hr-HR");
}

export function formatTurnover(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2).replace(".", ",") + "M €";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(".", ",") + "K €";
  }
  return value.toLocaleString("hr-HR") + " €";
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return sign + value.toFixed(2).replace(".", ",") + "%";
}

export function changeColor(value: number): string {
  if (value > 0) return "text-[#0ea371]";
  if (value < 0) return "text-[#e04363]";
  return "text-[#8b8fa3]";
}

export function changeBg(value: number): string {
  if (value > 0) return "bg-[#0ea371]/10 border-[#0ea371]/30";
  if (value < 0) return "bg-[#e04363]/10 border-[#e04363]/30";
  return "bg-[#8b8fa3]/10 border-[#8b8fa3]/30";
}
