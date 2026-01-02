import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar
          user={{
            email: user.email,
            full_name: user.user_metadata?.full_name,
          }}
        />
      </div>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
