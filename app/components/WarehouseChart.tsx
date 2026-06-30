"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    name: string;
    total: number;
  }[];
}

export default function WarehouseChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="name"
          angle={-20}
          textAnchor="end"
          interval={0}
          height={90}
        />

        <YAxis />

        <Tooltip />

        <Bar dataKey="total" fill="#ea580c" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
