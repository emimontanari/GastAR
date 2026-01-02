import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to transactions as the main view
  redirect("/transactions")
}
