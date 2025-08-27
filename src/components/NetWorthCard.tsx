import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useBanks } from '../contexts/BankContext';

interface NetWorthCardProps {
  isDarkMode: boolean;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({ isDarkMode }) => {
  const { expenses } = useExpenses();
  const { currentBank } = useBanks();
  
  const opening = currentBank?.initialBalance ?? 0;
  const totalExpense = expenses.filter(e => (e.type ?? 'expense') === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = expenses.filter(e => (e.type ?? 'expense') === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalBalance = opening - totalExpense + totalIncome;
  const totalTransactions = expenses.length;
  
  const monthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });
  
  const monthlyExpense = monthExpenses.filter(e => (e.type ?? 'expense') === 'expense').reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyIncome = monthExpenses.filter(e => (e.type ?? 'expense') === 'income').reduce((sum, exp) => sum + exp.amount, 0);
  
  return (
    <div className={`rounded-2xl p-6 ${
      isDarkMode 
        ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
        : 'bg-white/70 backdrop-blur-sm border border-gray-200/50'
    }`}>
      <div className="text-center mb-6">
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Net Worth
        </h3>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {totalTransactions} transactions
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Expense
            </span>
          </div>
          <p className="text-xl font-bold text-red-500">
            ₹{monthlyExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{monthExpenses.filter(e => (e.type ?? 'expense') === 'expense').length} transactions</p>
        </div>
        
        <div className={`p-4 rounded-xl ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Income
            </span>
          </div>
          <p className="text-xl font-bold text-green-500">
            ₹{monthlyIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{monthExpenses.filter(e => (e.type ?? 'expense') === 'income').length} transactions</p>
        </div>
      </div>
    </div>
  );
};