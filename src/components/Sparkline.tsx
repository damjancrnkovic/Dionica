"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  price: number;
  change: number;
}

function generateSparklineData(price: number, change: number) {
  const points = 20;
  const data = [];
  const startPrice = price / (1 + change / 100);
  const step = (price - startPrice) / points;

  for (let i = 0; i <= points; i++) {
    const noise = (Math.random() - 0.5) * price * 0.008;
    data.push({
      value: startPrice + step * i + noise,
    });
  }
  return data;
}

export default function Sparkline({ price, change }: SparklineProps) {
  const data = generateSparklineData(price, change);
  const color = change >= 0 ? "#0ea371" : "#e04363";

  return (
    <div className="w-full h-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
