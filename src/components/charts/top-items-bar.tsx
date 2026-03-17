"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

type Entry = { name: string; value: number; rate: number };

function rateColor(rate: number) {
  if (rate >= 30) return "#ef4444";
  if (rate >= 20) return "#f97316";
  if (rate >= 10) return "#eab308";
  return "#10b981";
}

const tip = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#fafafa",
};

export function TopItemsBar({ data }: { data: Entry[] }) {
  if (data.length === 0) return null;

  const height = Math.max(200, data.length * 36);

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800 sm:p-6">
      <h3 className="mb-4 text-sm font-medium">Top items by tariff cost</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <XAxis
            type="number"
            tick={{ fill: "#71717a", fontSize: 11 }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, i) => (
              <Cell key={i} fill={rateColor(entry.rate)} />
            ))}
          </Bar>
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Tariff cost"]}
            contentStyle={tip}
            itemStyle={{ color: "#a1a1aa" }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
