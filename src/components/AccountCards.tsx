import React, { useState } from 'react';
import { CreditCard, Wallet, PiggyBank, Plus, Trash2, Edit3 } from 'lucide-react';
import { useBanks } from '../contexts/BankContext';
import { useExpenses } from '../contexts/ExpenseContext';

interface AccountCardsProps {
  isDarkMode: boolean;
}

export const AccountCards: React.FC<AccountCardsProps> = ({ isDarkMode }) => {
  const { banks, currentBankId, switchBank, addBank, deleteBank, renameBank } = useBanks();
  const { expenses } = useExpenses();

  const iconByIndex = [CreditCard, Wallet, PiggyBank];
  const colorByIndex = ['from-purple-500 to-purple-600', 'from-blue-500 to-blue-600', 'from-green-500 to-green-600'];

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [errors, setErrors] = useState<{ name?: string; balance?: string }>({});
  const [editBankId, setEditBankId] = useState<string | null>(null);

  const resetModal = () => {
    setNewBankName('');
    setOpeningBalance('0');
    setErrors({});
  };

  const validate = () => {
    const e: { name?: string; balance?: string } = {};
    if (!newBankName.trim()) e.name = 'Enter a bank name';
    const bal = parseFloat(openingBalance);
    if (isNaN(bal) || bal < 0) e.balance = 'Enter a valid amount (>= 0)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateBank = async (ev?: React.FormEvent) => {
    if (ev) ev.preventDefault();
    if (!validate()) return;
    const bal = parseFloat(openingBalance) || 0;
    await addBank(newBankName.trim(), bal);
    setShowAddModal(false);
    resetModal();
  };

  const openEdit = (bankId: string, name: string, balance: number) => {
    setEditBankId(bankId);
    setNewBankName(name);
    setOpeningBalance(String(balance ?? 0));
    setErrors({});
    setShowAddModal(true);
  };

  const handleSaveEdit = async (ev?: React.FormEvent) => {
    if (ev) ev.preventDefault();
    if (!validate() || !editBankId) return;
    const bal = parseFloat(openingBalance) || 0;
    await renameBank(editBankId, newBankName.trim(), bal);
    setShowAddModal(false);
    setEditBankId(null);
    resetModal();
  };

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {banks.map((bank, index) => (
        <div
          key={bank.id}
          className={`rounded-2xl p-6 transition-all duration-200 hover:scale-105 cursor-pointer ${
            bank.id === currentBankId 
              ? `bg-gradient-to-br ${colorByIndex[index % colorByIndex.length]} text-white shadow-lg` 
              : isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white hover:bg-gray-800/70' 
                : 'bg-white/70 backdrop-blur-sm border border-gray-200/50 text-gray-900 hover:bg-white/80'
          }`}
          onClick={() => switchBank(bank.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold truncate" title={bank.name}>{bank.name}</h3>
            <div className="flex items-center space-x-2">
              {React.createElement(iconByIndex[index % iconByIndex.length], { className: 'w-6 h-6 opacity-80' })}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (banks.length <= 1) return; // keep at least one bank
                  if (confirm(`Delete bank "${bank.name}"? This will keep data in storage for other banks.`)) {
                    deleteBank(bank.id);
                  }
                }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-1 rounded-lg`}
                title="Delete bank"
              >
                <Trash2 className={`w-4 h-4 ${bank.id === currentBankId ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold">
              ₹{(
                (bank.initialBalance ?? 0)
                - expenses.filter(e => (e.type ?? 'expense') === 'expense').reduce((s, e) => s + e.amount, 0)
                + expenses.filter(e => (e.type ?? 'expense') === 'income').reduce((s, e) => s + e.amount, 0)
              ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Current balance</p>
          </div>
        </div>
      ))}

      {/* Add bank card */}
      <button
        onClick={() => { setShowAddModal(true); }}
        className={`rounded-2xl p-6 transition-all duration-200 border-2 border-dashed ${
          isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800/40' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        } flex items-center justify-center`}
      >
        <div className="flex items-center space-x-3">
          <Plus className="w-6 h-6" />
          <span className="font-medium">Add Bank</span>
        </div>
      </button>
    </div>

    {/* Add Bank Modal */}
    {showAddModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => { setShowAddModal(false); resetModal(); }} />
        <div className={`relative w-full max-w-md mx-4 rounded-2xl p-6 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{editBankId ? 'Edit Bank' : 'Add Bank'}</h3>
          <form onSubmit={editBankId ? handleSaveEdit : handleCreateBank} className="space-y-4">
            <div>
              <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bank name</label>
              <input
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="e.g., SBI Savings"
                autoFocus
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Opening balance (₹)</label>
              <input
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="0"
                inputMode="decimal"
              />
              {errors.balance && <p className="text-red-500 text-sm mt-1">{errors.balance}</p>}
            </div>
            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => { setShowAddModal(false); resetModal(); }} className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">{editBankId ? 'Save' : 'Create'}</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};