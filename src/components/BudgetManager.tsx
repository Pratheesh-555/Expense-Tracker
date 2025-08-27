import React, { useState } from 'react';
import { Target, Plus, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

interface BudgetManagerProps {
  isDarkMode: boolean;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly';
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({ isDarkMode }) => {
  const { expenses } = useExpenses();
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food', limit: 2000, spent: 1250, period: 'monthly' },
    { id: '2', category: 'Transport', limit: 800, spent: 650, period: 'monthly' },
    { id: '3', category: 'Entertainment', limit: 500, spent: 320, period: 'monthly' },
    { id: '4', category: 'Books', limit: 1000, spent: 200, period: 'monthly' },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly' as 'weekly' | 'monthly'
  });

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return { status: 'danger', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (percentage >= 75) return { status: 'warning', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    return { status: 'good', color: 'text-green-500', bgColor: 'bg-green-500' };
  };

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.limit) {
      const budget: Budget = {
        id: Date.now().toString(),
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        spent: 0,
        period: newBudget.period
      };
      setBudgets([...budgets, budget]);
      setNewBudget({ category: '', limit: '', period: 'monthly' });
      setShowAddForm(false);
    }
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Budget Manager
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200/50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Create New Budget
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Category"
              value={newBudget.category}
              onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
              className={`px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <input
              type="number"
              placeholder="Budget Limit (₹)"
              value={newBudget.limit}
              onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
              className={`px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <select
              value={newBudget.period}
              onChange={(e) => setNewBudget({...newBudget, period: e.target.value as 'weekly' | 'monthly'})}
              className={`px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleAddBudget}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Create Budget
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className={`px-6 py-2 rounded-xl transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const { status, color, bgColor } = getBudgetStatus(budget.spent, budget.limit);
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
          
          return (
            <div
              key={budget.id}
              className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}>
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {budget.category}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {budget.period}ly budget
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    <Edit className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                  <button 
                    onClick={() => deleteBudget(budget.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{budget.spent.toLocaleString('en-IN')}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    / ₹{budget.limit.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className={`w-full h-3 rounded-full ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${bgColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className={`${color} font-medium`}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span className={`font-medium ${
                    remaining >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {remaining >= 0 
                      ? `₹${remaining.toLocaleString('en-IN')} left` 
                      : `₹${Math.abs(remaining).toLocaleString('en-IN')} over`
                    }
                  </span>
                </div>
                
                {status === 'danger' && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">Budget limit exceeded!</span>
                  </div>
                )}
                
                {status === 'warning' && (
                  <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-700">Approaching budget limit</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};