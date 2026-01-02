import { createClient } from "@/lib/supabase/server"
import { AccountsView } from "@/components/accounts/accounts-view"

export default async function AccountsPage() {
  const supabase = await createClient()

  // Fetch accounts
  const { data: accounts } = await supabase.from("accounts").select("*").order("created_at", { ascending: false })

  // Fetch recent transactions for selected account
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select(`
      *,
      categories(*),
      accounts(*)
    `)
    .order("date", { ascending: false })
    .limit(50)

  // Transform the data to match the expected structure
  const transformedTransactions = transactions?.map(transaction => ({
    ...transaction,
    category: transaction.categories || (transaction.category_name ? {
      id: '',
      user_id: transaction.user_id,
      name: transaction.category_name,
      icon: transaction.category_icon,
      created_at: ''
    } : null),
    account: transaction.accounts
  }))

  return <AccountsView accounts={accounts || []} transactions={transformedTransactions || []} />
}
