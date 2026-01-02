"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { label: "Panel", href: "/dashboard" },
  { label: "Transacciones", href: "/transactions" },
  { label: "Inversiones", href: "/investments", badge: "Pronto", disabled: true },
  { label: "Presupuestos", href: "/budgets" },
  { label: "Cuentas", href: "/accounts" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 overflow-x-auto border-b border-border bg-background px-4 py-2 md:hidden">
      {mobileNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.disabled ? "#" : item.href}
          className={cn(
            "flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors",
            pathname === item.href
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            item.disabled && "opacity-50 pointer-events-none",
          )}
        >
          {item.label}
          {item.badge && (
            <span className="rounded bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  )
}
