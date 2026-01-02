import type React from "react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  value: string
  currency?: string
  icon?: React.ReactNode
  variant?: "default" | "negative" | "positive"
  className?: string
}

export function StatsCard({ label, value, currency = "ARS", icon, variant = "default", className }: StatsCardProps) {
  return (
    <div className={cn("flex flex-col gap-1 rounded-lg border border-border bg-card p-4", className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {icon}
        <span
          className={cn(
            "text-xl font-semibold",
            variant === "negative" && "text-red-500",
            variant === "positive" && "text-green-500",
            variant === "default" && "text-foreground",
          )}
        >
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{currency}</span>
      </div>
    </div>
  )
}
