import React from 'react';
import { Coffee, Car, Book, ShoppingBag, Utensils, Plus } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

const quickExpenses = [
  { label: 'Canteen', amount: 50, icon: Coffee, color: 'bg-orange-500' },
  { label: 'Auto', amount: 30, icon: Car, color: 'bg-blue-500' },
  { label: 'Books', amount: 200, icon: Book, color: 'bg-green-500' },
  { label: 'Snacks', amount: 25, icon: ShoppingBag, color: 'bg-purple-500' },
  { label: 'Mess', amount: 80, icon: Utensils, color: 'bg-red-500' },
];

export const QuickActions: React.FC = () => {
  const { addExpense } = useExpenses();

  const handleQuickExpense = (expense: typeof quickExpenses[0]) => {
    addExpense({
      amount: expense.amount,
      category: expense.label,
      description: `Quick ${expense.label} expense`,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add</h3>
      <div className="flex flex-wrap gap-3">
        {quickExpenses.map((expense, index) => (
          <button
            key={index}
            onClick={() => handleQuickExpense(expense)}
            className="flex items-center space-x-2 px-4 py-3 bg-white rounded-xl border border-gray-200/50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className={`w-8 h-8 ${expense.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <expense.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{expense.label}</p>
              <p className="text-xs text-gray-500">₹{expense.amount}</p>
            </div>
          </button>
        ))}
        
        <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};