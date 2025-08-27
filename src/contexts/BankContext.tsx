import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StorageService, BankAccount } from '../services/storage';

interface BankContextType {
  banks: BankAccount[];
  currentBankId: string | null;
  currentBank: BankAccount | null;
  addBank: (name: string, initialBalance?: number) => Promise<void>;
  switchBank: (bankId: string) => void;
  renameBank: (bankId: string, name: string, initialBalance?: number) => Promise<void>;
  deleteBank: (bankId: string) => Promise<void>;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const useBanks = (): BankContextType => {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error('useBanks must be used within BankProvider');
  return ctx;
};

const CURRENT_BANK_KEY = 'sastra-current-bank-id';

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [currentBankId, setCurrentBankId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const existing = await StorageService.getBanks();
      if (existing.length === 0) {
        const defaultBank: BankAccount = { id: crypto.randomUUID(), name: 'Default Bank', createdAt: Date.now(), initialBalance: 0 };
        setBanks([defaultBank]);
        setCurrentBankId(defaultBank.id);
        await StorageService.saveBanks([defaultBank]);
        await StorageService.migrateLegacyToBank(defaultBank.id);
      } else {
        setBanks(existing);
        const savedId = localStorage.getItem(CURRENT_BANK_KEY);
        setCurrentBankId(savedId && existing.find(b => b.id === savedId) ? savedId : existing[0].id);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentBankId) localStorage.setItem(CURRENT_BANK_KEY, currentBankId);
  }, [currentBankId]);

  const currentBank = useMemo(() => banks.find(b => b.id === currentBankId) ?? null, [banks, currentBankId]);

  const persist = async (updated: BankAccount[]) => {
    setBanks(updated);
    await StorageService.saveBanks(updated);
  };

  const addBank = async (name: string, initialBalance: number = 0) => {
    const newBank: BankAccount = { id: crypto.randomUUID(), name: name.trim() || 'New Bank', createdAt: Date.now(), initialBalance };
    const updated = [...banks, newBank];
    await persist(updated);
    setCurrentBankId(newBank.id);
  };

  const switchBank = (bankId: string) => {
    if (banks.find(b => b.id === bankId)) setCurrentBankId(bankId);
  };

  const renameBank = async (bankId: string, name: string, initialBalance?: number) => {
    const updated = banks.map(b => (
      b.id === bankId ? { ...b, name: name.trim(), initialBalance: initialBalance ?? b.initialBalance } : b
    ));
    await persist(updated);
  };

  const deleteBank = async (bankId: string) => {
    if (banks.length <= 1) return; // keep at least one bank
    const updated = banks.filter(b => b.id !== bankId);
    await persist(updated);
    if (currentBankId === bankId) setCurrentBankId(updated[0]?.id ?? null);
  };

  return (
    <BankContext.Provider value={{ banks, currentBankId, currentBank, addBank, switchBank, renameBank, deleteBank }}>
      {children}
    </BankContext.Provider>
  );
};


