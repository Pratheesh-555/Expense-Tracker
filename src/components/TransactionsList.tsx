import React, { useMemo, useState } from 'react';
import { Search, Gift, User, Utensils, Plane, ShoppingBag, Heart, Plus, Edit2 } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

interface TransactionsListProps {
  isDarkMode: boolean;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ isDarkMode }) => {
  const { expenses, deleteExpense, updateExpense } = useExpenses();
  const [filter, setFilter] = useState<'All' | 'Expense' | 'Income'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<{ amount: string; category: string; description: string; date: string; type: 'expense' | 'income' }>({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0], type: 'expense' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getTransactionIcon = (category: string, description: string) => {
    const iconMap: { [key: string]: any } = {
      'Gpay rewards': Gift,
      'Family': User,
      'Idly Vada': Utensils,
      'Bus ticket': Plane,
      'Food': Utensils,
      'Snack': ShoppingBag,
      'Medicine': Heart,
      'Canteen': Utensils,
      'Auto': Plane,
      'Books': ShoppingBag,
    };
    
    return iconMap[category] || iconMap[description] || ShoppingBag;
  };

  const getTransactionColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Gpay rewards': 'bg-red-500',
      'Family': 'bg-blue-500',
      'Idly Vada': 'bg-gray-600',
      'Bus ticket': 'bg-orange-500',
      'Food': 'bg-gray-600',
      'Snack': 'bg-gray-600',
      'Medicine': 'bg-green-500',
      'Canteen': 'bg-orange-500',
      'Auto': 'bg-blue-500',
      'Books': 'bg-green-500',
    };
    
    return colorMap[category] || 'bg-gray-500';
  };

  const allTransactions = useMemo(() => (
    expenses.map(exp => ({
      ...exp,
      type: (exp.type ?? 'expense') as 'expense' | 'income'
    }))
  ), [expenses]);

  const filteredTransactions = allTransactions
    .filter(transaction => {
      if (filter === 'All') return true;
      if (filter === 'Expense') return (transaction.type ?? 'expense') === 'expense';
      if (filter === 'Income') return (transaction.type ?? 'expense') === 'income';
      return true;
    })
    .filter(transaction => 
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as { [key: string]: typeof filteredTransactions });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Transactions
        </h2>
        <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <div className="flex space-x-2">
          {['All', 'Expense', 'Income'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([date, transactions]) => {
          const dayTotal = transactions.reduce((sum, t) => sum + (t.type === 'expense' ? -t.amount : t.amount), 0);
          
          return (
            <div key={date}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {date}
                </h3>
                <span className={`font-semibold ${
                  dayTotal >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  ₹{Math.abs(dayTotal).toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="space-y-2">
                {transactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.category, transaction.description);
                  
                  return (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-800/50 hover:bg-gray-800/70' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          getTransactionColor(transaction.category)
                        }`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {transaction.category}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {transaction.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditId(transaction.id);
                            setForm({
                              amount: String(transaction.amount),
                              category: transaction.category,
                              description: transaction.description,
                              date: transaction.date,
                              type: (transaction.type ?? 'expense') as 'expense' | 'income'
                            });
                          }}
                          className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-1 rounded-lg`}
                          title="Edit"
                        >
                          <Edit2 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
                        </button>
                        <span className={`font-semibold ${
                          (transaction.type ?? 'expense') === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {(transaction.type ?? 'expense') === 'income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Transaction Modal */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setEditId(null); setErrors({}); }} />
          <div className={`relative w-full max-w-md mx-4 rounded-2xl p-6 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Transaction</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newErrors: Record<string, string> = {};
                const amt = parseFloat(form.amount);
                if (isNaN(amt) || amt <= 0) newErrors.amount = 'Enter a valid amount';
                if (!form.category.trim()) newErrors.category = 'Category required';
                if (!form.description.trim()) newErrors.description = 'Description required';
                if (!form.date) newErrors.date = 'Date required';
                setErrors(newErrors);
                if (Object.keys(newErrors).length > 0) return;
                updateExpense(editId, { amount: amt, category: form.category, description: form.description, date: form.date, type: form.type });
                setEditId(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'expense' | 'income' })} className={`w-full px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount (₹)</label>
                  <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={`w-full px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`w-full px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`w-full px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`w-full px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => { setEditId(null); setErrors({}); }} className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};