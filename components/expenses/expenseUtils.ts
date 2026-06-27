import {Transaction} from './ExpenseStore';

export const money = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
export const shortDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
export const currentMonth = () =>
  new Date().toLocaleDateString(undefined, {month: 'long', year: 'numeric'});
export const categoryIcon = (category: string) =>
  ({
    Salary: 'briefcase',
    Freelance: 'zap',
    Food: 'coffee',
    Travel: 'map-pin',
    Shopping: 'shopping-bag',
    Bills: 'file-text',
    Health: 'heart',
    Other: 'grid',
  }[category] ?? 'circle');
export const categoryColor = (category: string) =>
  ({
    Salary: '#E0F7EC',
    Freelance: '#E6F0FF',
    Food: '#FFF0DD',
    Travel: '#E8E5FF',
    Shopping: '#FFE5EB',
    Bills: '#E6ECEF',
    Health: '#FFE5E5',
    Other: '#ECEEEB',
  }[category] ?? '#ECEEEB');
export const monthlyTotals = (transactions: Transaction[]) => {
  const now = new Date();
  return transactions.reduce(
    (totals, transaction) => {
      const date = new Date(transaction.date);
      if (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        totals[transaction.type] += transaction.amount;
      }
      return totals;
    },
    {income: 0, expense: 0},
  );
};
