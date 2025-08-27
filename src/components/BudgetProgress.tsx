import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export const BudgetProgress: React.FC = () => {
  const { expenses } = useExpenses();
  
  const monthlyBudget = 5000; // Default budget for students
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });
  
  const spent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const percentage = (spent / monthlyBudget) * 100;
  const remaining = monthlyBudget - spent;

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (percentage >= 90) return AlertTriangle;
    if (percentage >= 75) return TrendingUp;
    return CheckCircle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Budget</h3>
        <StatusIcon className={`w-5 h-5 ${getStatusColor()}`} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">₹{spent.toFixed(2)}</span>
          <span className="text-sm text-gray-600">/ ₹{monthlyBudget}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              percentage >= 90 ? 'bg-red-500' :
              percentage >= 75 ? 'bg-orange-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{percentage.toFixed(1)}% used</span>
          <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remaining >= 0 ? `₹${remaining.toFixed(2)} left` : `₹${Math.abs(remaining).toFixed(2)} over`}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Categories</h4>
          <div className="space-y-2">
            {Object.entries(
              monthExpenses.reduce((acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                return acc;
              }, {} as Record<string, number>)
            )
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{category}</span>
                <span className="text-sm font-medium text-gray-900">₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};