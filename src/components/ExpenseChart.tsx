import React, { useMemo } from 'react';
import { useExpenses } from '../contexts/ExpenseContext';

export const ExpenseChart: React.FC = () => {
  const { expenses } = useExpenses();
  
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    return last7Days.map(dateStr => {
      const dayExpenses = expenses.filter(exp => 
        new Date(exp.date).toDateString() === dateStr
      );
      const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return {
        date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        amount: total
      };
    });
  }, [expenses]);

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Spending</h3>
      
      <div className="flex items-end justify-between h-48 space-x-2">
        {chartData.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
              <div 
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 delay-100"
                style={{ 
                  height: `${(day.amount / maxAmount) * 160}px`,
                  minHeight: day.amount > 0 ? '4px' : '0px'
                }}
              />
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-600 font-medium">{day.date}</p>
              <p className="text-xs text-gray-500">₹{day.amount.toFixed(0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};