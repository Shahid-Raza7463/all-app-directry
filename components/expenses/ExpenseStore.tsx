import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type TransactionType = 'income' | 'expense';
export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: string;
};

type TransactionInput = Omit<Transaction, 'id' | 'date'>;
type ExpenseContextValue = {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (input: TransactionInput) => void;
  updateTransaction: (id: string, input: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
};

export const categories = [
  'Salary',
  'Freelance',
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Health',
  'Other',
];
const STORAGE_KEY = '@expense_tracker/transactions';
const ExpenseContext = createContext<ExpenseContextValue | undefined>(
  undefined,
);

export const ExpenseProvider = ({children}: {children: React.ReactNode}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTransactions(JSON.parse(stored));
        }
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
        setReady(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [ready, transactions]);

  const value = useMemo<ExpenseContextValue>(
    () => ({
      transactions,
      loading,
      addTransaction: input =>
        setTransactions(current => [
          {
            ...input,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            date: new Date().toISOString(),
          },
          ...current,
        ]),
      updateTransaction: (id, input) =>
        setTransactions(current =>
          current.map(transaction =>
            transaction.id === id ? {...transaction, ...input} : transaction,
          ),
        ),
      deleteTransaction: id =>
        setTransactions(current =>
          current.filter(transaction => transaction.id !== id),
        ),
    }),
    [loading, transactions],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used inside ExpenseProvider');
  }
  return context;
};

export const isCurrentMonth = (date: string) => {
  const value = new Date(date);
  const now = new Date();
  return (
    value.getMonth() === now.getMonth() &&
    value.getFullYear() === now.getFullYear()
  );
};
