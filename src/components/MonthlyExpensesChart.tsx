
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from "@/pages/Index";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({ transactions }) => {
  // Process transactions to get monthly expense data
  const monthlyData = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const monthlyTotals: Record<string, number> = {};

    expenses.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + transaction.amount;
    });

    // Convert to array and sort by date
    const data = Object.entries(monthlyTotals)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }),
        amount,
        fullDate: month
      }))
      .sort((a, b) => a.fullDate.localeCompare(b.fullDate));

    // If no data, show current month with 0
    if (data.length === 0) {
      const currentMonth = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      return [{ month: currentMonth, amount: 0, fullDate: '' }];
    }

    return data;
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Expenses: <span className="font-semibold">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="amount" 
            fill="url(#colorGradient)"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
