import { createClient } from "@/lib/supabase/server"
import { TransactionsView } from "@/components/transactions/transactions-view"

export default async function TransactionsPage() {
  const supabase = await createClient()

  // Fetch transactions with related data
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      category:categories(*),
      account:accounts(*)
    `)
    .order("date", { ascending: false })
    .limit(100)

  // Fetch categories for filters
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch accounts for filters
  const { data: accounts } = await supabase.from("accounts").select("*").order("name")

  return (
    <TransactionsView
      initialTransactions={transactions || []}
      categories={categories || []}
      accounts={accounts || []}
    />
  )
}
