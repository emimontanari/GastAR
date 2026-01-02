"use client"

import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Account } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AccountCardProps {
  account: Account
  isSelected?: boolean
  onClick?: () => void
}

export function AccountCard({ account, isSelected, onClick }: AccountCardProps) {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount))
    return formatted
  }

  const renderAccountIcon = () => {
    if (account.icon && account.icon.startsWith("http")) {
      return (
        <Image
          src={account.icon || "/placeholder.svg"}
          alt={account.name}
          width={32}
          height={32}
          className="h-8 w-8 rounded-lg object-contain"
        />
      )
    }
    if (account.icon) {
      return <span className="text-xl">{account.icon}</span>
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <span className="text-sm font-medium">{account.name.charAt(0).toUpperCase()}</span>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex min-w-[250px] cursor-pointer flex-col rounded-xl border-2 border-border bg-card p-4 transition-all hover:border-primary/50",
        isSelected && "border-primary",
      )}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {renderAccountIcon()}
          <span className="font-medium text-foreground">{account.name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Ver transacciones</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <span className={cn("text-2xl font-bold", account.balance < 0 ? "text-red-500" : "text-green-500")}>
          {account.balance < 0 ? "-" : ""}
          {formatCurrency(account.balance)}
        </span>
        <span className="ml-2 text-sm text-muted-foreground">{account.currency}</span>
      </div>
    </div>
  )
}
