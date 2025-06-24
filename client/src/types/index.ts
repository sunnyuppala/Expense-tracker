export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Budget {
  id?: string;
  category: string;
  amount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  token: string | null;
}

export type ExpenseCategory =
  | "food"
  | "transportation"
  | "housing"
  | "utilities"
  | "entertainment"
  | "healthcare"
  | "education"
  | "shopping"
  | "travel"
  | "other";

export const CATEGORIES: ExpenseCategory[] = [
  "food",
  "transportation",
  "housing",
  "utilities",
  "entertainment",
  "healthcare",
  "education",
  "shopping",
  "travel",
  "other",
];

export interface DateRange {
  startDate: string;
  endDate: string;
}
