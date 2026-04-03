import React from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { formatCurrency } from "../lib/utils";

interface ProgressChartProps {
  current: number;
  target: number;
  color: string;
}

export function ProgressCircle({ current, target, color }: ProgressChartProps) {
  const data = [
    { name: "Saved", value: current },
    { name: "Remaining", value: Math.max(0, target - current) },
  ];

  const percentage = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="relative h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill={color} />
            <Cell fill="#E5E7EB" />
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-light text-gray-900">{percentage}%</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider">Progress</span>
      </div>
    </div>
  );
}

interface ContributionData {
  date: string;
  amount: number;
}

export function ContributionHistory({ data, color }: { data: ContributionData[], color: string }) {
  return (
    <div className="h-64 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            cursor={{ fill: '#F9FAFB' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Bar dataKey="amount" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
