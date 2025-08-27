export interface BankAccount {
  id: string;
  name: string;
  createdAt: number;
  initialBalance: number; // opening balance provided by user (can be 0)
}

export interface StoredExpense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const BANKS_KEY = 'sastra-banks';
const EXPENSES_BY_BANK_KEY = 'sastra-expenses-by-bank';
const LEGACY_EXPENSES_KEY = 'sastra-expenses';

const apiBase = import.meta?.env?.VITE_API_BASE_URL as string | undefined;

const readJSON = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
};

const writeJSON = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const StorageService = {
  // Banks
  getBanks: async (): Promise<BankAccount[]> => {
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/banks`);
        if (res.ok) return await res.json();
      } catch {}
    }
    return readJSON<BankAccount[]>(BANKS_KEY, []);
  },

  saveBanks: async (banks: BankAccount[]): Promise<void> => {
    if (apiBase) {
      try {
        await fetch(`${apiBase}/banks`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(banks) });
      } catch {}
    }
    writeJSON(BANKS_KEY, banks);
  },

  // Expenses per bank
  getExpensesByBank: async (bankId: string): Promise<StoredExpense[]> => {
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/banks/${bankId}/expenses`);
        if (res.ok) return await res.json();
      } catch {}
    }
    const map = readJSON<Record<string, StoredExpense[]>>(EXPENSES_BY_BANK_KEY, {});
    return map[bankId] ?? [];
  },

  saveExpensesByBank: async (bankId: string, expenses: StoredExpense[]): Promise<void> => {
    if (apiBase) {
      try {
        await fetch(`${apiBase}/banks/${bankId}/expenses`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(expenses) });
      } catch {}
    }
    const map = readJSON<Record<string, StoredExpense[]>>(EXPENSES_BY_BANK_KEY, {});
    map[bankId] = expenses;
    writeJSON(EXPENSES_BY_BANK_KEY, map);
  },

  // Migration from legacy single store to default bank
  migrateLegacyToBank: async (defaultBankId: string): Promise<void> => {
    const legacy = readJSON<StoredExpense[]>(LEGACY_EXPENSES_KEY, []);
    if (legacy.length === 0) return;
    const map = readJSON<Record<string, StoredExpense[]>>(EXPENSES_BY_BANK_KEY, {});
    if (!map[defaultBankId] || map[defaultBankId].length === 0) {
      map[defaultBankId] = legacy;
      writeJSON(EXPENSES_BY_BANK_KEY, map);
    }
    localStorage.removeItem(LEGACY_EXPENSES_KEY);
  }
};


