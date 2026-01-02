export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  icon?: string
  color?: string
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: "bank" | "wallet" | "credit_card" | "cash"
  currency: string
  balance: number
  icon?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  account_id?: string
  category_id?: string
  description: string
  amount: number
  currency: string
  type: "income" | "expense" | "transfer"
  date: string
  is_recurring: boolean
  origin?: string
  tags?: string[]
  created_at: string
  updated_at: string
  // Joined fields
  category?: Category
  account?: Account
}

export interface Budget {
  id: string
  user_id: string
  category_id?: string
  name: string
  amount: number
  currency: string
  period: "weekly" | "monthly" | "yearly"
  start_date: string
  end_date?: string
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  currency: string
  target_date?: string
  icon?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  categoryId?: string
  accountId?: string
  type?: "income" | "expense" | "transfer"
  currency?: string
}
