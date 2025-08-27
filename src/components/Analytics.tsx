import React, { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

interface AnalyticsProps {
  isDarkMode: boolean;
}

export const Analytics: React.FC<AnalyticsProps> = ({ isDarkMode }) => {
  const { expenses } = useExpenses();
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('category');

  const getCategoryData = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);
  };

  const getMonthlyData = () => {
    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyTotals);
  };

  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgDaily = totalSpent / 30;

  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 
    'bg-orange-500', 'bg-red-500', 'bg-pink-500'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Analytics
        </h2>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-2xl ${
          isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Spent
            </span>
          </div>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
        </div>

        <div className={`p-6 rounded-2xl ${
          isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-6 h-6 text-green-500" />
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Daily Average
            </span>
          </div>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ₹{avgDaily.toFixed(0)}
          </p>
        </div>

        <div className={`p-6 rounded-2xl ${
          isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3 mb-2">
            <PieChart className="w-6 h-6 text-purple-500" />
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Categories
            </span>
          </div>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {categoryData.length}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200/50'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Spending by Category
        </h3>
        
        <div className="space-y-4">
          {categoryData.map(([category, amount], index) => {
            const percentage = (amount / totalSpent) * 100;
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${colors[index]}`} />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{amount.toLocaleString('en-IN')}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className={`w-full h-2 rounded-full ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-2 rounded-full ${colors[index]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className={`p-6 rounded-2xl ${
        isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200/50'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Monthly Spending Trend
        </h3>
        
        <div className="flex items-end justify-between h-48 space-x-2">
          {monthlyData.map(([month, amount], index) => {
            const maxAmount = Math.max(...monthlyData.map(([,amt]) => amt));
            const height = (amount / maxAmount) * 160;
            
            return (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div className={`w-full rounded-t-lg transition-all duration-500 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${height}px`, minHeight: amount > 0 ? '4px' : '0px' }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {month}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ₹{amount.toFixed(0)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};