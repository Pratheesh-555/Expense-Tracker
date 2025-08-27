import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBanks } from './BankContext';
import { StorageService } from '../services/storage';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type?: 'expense' | 'income';
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { currentBankId } = useBanks();

  // Load expenses for current bank
  useEffect(() => {
    (async () => {
      if (!currentBankId) return;
      const data = await StorageService.getExpensesByBank(currentBankId);
      const migrated = data.map(e => ({ ...e, type: e.type ?? 'expense' }));
      setExpenses(migrated);
    })();
  }, [currentBankId]);

  // Persist expenses for current bank
  useEffect(() => {
    (async () => {
      if (!currentBankId) return;
      await StorageService.saveExpensesByBank(currentBankId, expenses);
    })();
  }, [currentBankId, expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      deleteExpense,
      updateExpense
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};