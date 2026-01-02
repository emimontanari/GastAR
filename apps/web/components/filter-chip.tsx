"use client"

import { X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterChipProps {
  label: string
  value?: string
  onRemove?: () => void
  onClick?: () => void
  removable?: boolean
  className?: string
}

export function FilterChip({ label, value, onRemove, onClick, removable = true, className }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs text-primary transition-colors hover:bg-primary/20",
        className,
      )}
    >
      <span>
        {label}
        {value && <span className="font-medium"> {value}</span>}
      </span>
      {removable ? (
        <X
          className="h-3 w-3 cursor-pointer hover:text-primary-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
        />
      ) : (
        <ChevronDown className="h-3 w-3" />
      )}
    </button>
  )
}
