import React from 'react';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export const RecentExpenses: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses();
  
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-700',
      'Transport': 'bg-blue-100 text-blue-700',
      'Books': 'bg-green-100 text-green-700',
      'Entertainment': 'bg-purple-100 text-purple-700',
      'Canteen': 'bg-orange-100 text-orange-700',
      'Auto': 'bg-blue-100 text-blue-700',
      'Snacks': 'bg-purple-100 text-purple-700',
      'Mess': 'bg-red-100 text-red-700',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        <button className="text-blue-600 text-sm hover:text-blue-700 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {recentExpenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No expenses yet. Add your first expense!</p>
          </div>
        ) : (
          recentExpenses.map((expense) => (
            <div 
              key={expense.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200/50 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">₹{expense.amount.toFixed(2)}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => deleteExpense(expense.id)}
                    className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};