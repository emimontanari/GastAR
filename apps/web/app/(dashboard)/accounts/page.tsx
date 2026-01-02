import { createClient } from "@/lib/supabase/server"
import { AccountsView } from "@/components/accounts/accounts-view"

export default async function AccountsPage() {
  const supabase = await createClient()

  // Fetch accounts
  const { data: accounts } = await supabase.from("accounts").select("*").order("created_at", { ascending: false })

  // Fetch recent transactions for selected account
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      category:categories(*),
      account:accounts(*)
    `)
    .order("date", { ascending: false })
    .limit(50)

  return <AccountsView accounts={accounts || []} transactions={transactions || []} />
}
