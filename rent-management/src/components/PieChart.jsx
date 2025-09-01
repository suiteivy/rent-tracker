import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F"]; // income, expenses, net

export default function IncomeExpensePieChart({ income = 0, expenses = 0, netIncome = 0 }) {
  const data = [
    { name: "Monthly Income", value: Number(income) || 0 },
    { name: "Total Expenses", value: Number(expenses) || 0 },
    { name: "Net Income", value: Number(netIncome) || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `Ksh ${value.toLocaleString()}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
