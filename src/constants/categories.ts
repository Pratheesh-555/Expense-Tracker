export const EXPENSE_CATEGORIES: string[] = [
  'Food',
  'Transport',
  'Books',
  'Entertainment',
  'Canteen',
  'Auto',
  'Snacks',
  'Mess',
  'Stationery',
  'Medical',
  'Other'
];

export const isValidCategory = (input: string): boolean => {
  return EXPENSE_CATEGORIES.some(
    c => c.toLowerCase() === input.trim().toLowerCase()
  );
};

export const normalizeCategory = (input: string): string => {
  const lower = input.trim().toLowerCase();
  const match = EXPENSE_CATEGORIES.find(c => c.toLowerCase() === lower);
  return match ?? input.trim();
};

