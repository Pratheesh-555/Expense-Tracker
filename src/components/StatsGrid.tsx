import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export const StatsGrid: React.FC = () => {
  const { expenses } = useExpenses();
  
  const today = new Date().toDateString();
  const todayExpenses = expenses.filter(exp => new Date(exp.date).toDateString() === today);
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const monthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });
  const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const stats = [
    {
      label: "Today's Spending",
      value: `₹${todayTotal.toFixed(2)}`,
      change: "+12%",
      isPositive: false,
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      label: "This Month",
      value: `₹${monthTotal.toFixed(2)}`,
      change: "+8%",
      isPositive: false,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Average Daily",
      value: `₹${(monthTotal / new Date().getDate()).toFixed(2)}`,
      change: "-3%",
      isPositive: true,
      icon: TrendingDown,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Savings Goal",
      value: "67%",
      change: "+15%",
      isPositive: true,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:bg-white/80 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <span className={`text-sm font-medium ${
              stat.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
          <p className="text-gray-600 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};