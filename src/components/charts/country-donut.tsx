"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

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

export function CountryDonut({ data }: { data: Entry[] }) {
  if (data.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800 sm:p-6">
      <h3 className="mb-4 text-sm font-medium">Tariff cost by country</h3>
      <div className="mx-auto aspect-square max-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={rateColor(entry.rate)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Tariff cost"]}
              contentStyle={tip}
              itemStyle={{ color: "#a1a1aa" }}
            />
            <Legend
              formatter={(value: string) => (
                <span style={{ color: "#a1a1aa", fontSize: "11px" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
