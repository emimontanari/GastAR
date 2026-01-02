"use client"

import { cn } from "@/lib/utils"

interface CurrencyBadgeProps {
  currency: string
  isActive?: boolean
  onClick?: () => void
}

export function CurrencyBadge({ currency, isActive, onClick }: CurrencyBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )}
    >
      {currency}
    </button>
  )
}
