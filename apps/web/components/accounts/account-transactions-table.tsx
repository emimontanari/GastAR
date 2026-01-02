"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  ArrowDown,
  Monitor,
  Smartphone,
  Rocket,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Transaction, Account } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AccountTransactionsTableProps {
  transactions: Transaction[]
  selectedAccountId: string | null
  selectedAccount?: Account | null
}

export function AccountTransactionsTable({
  transactions,
  selectedAccountId,
  selectedAccount,
}: AccountTransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount))
    return formatted
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMM d", { locale: es })
  }

  const getOriginIcon = (origin?: string) => {
    switch (origin) {
      case "whatsapp":
        return <Smartphone className="h-4 w-4 text-muted-foreground" />
      case "manual":
      default:
        return <Monitor className="h-4 w-4 text-muted-foreground" />
    }
  }

  const renderAccountIcon = (account?: Account | null, size: "sm" | "md" = "sm") => {
    const iconSize = size === "sm" ? "h-5 w-5" : "h-6 w-6"

    if (account?.icon && account.icon.startsWith("http")) {
      return (
        <Image
          src={account.icon || "/placeholder.svg"}
          alt={account.name}
          width={size === "sm" ? 20 : 24}
          height={size === "sm" ? 20 : 24}
          className={cn(iconSize, "rounded object-contain")}
        />
      )
    }
    if (account?.icon) {
      return <span className={size === "sm" ? "text-sm" : "text-base"}>{account.icon}</span>
    }
    return null
  }

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage)

  const TableHeader = () => (
    <thead>
      <tr className="border-b border-border">
        <th className="p-4 text-left">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-sm font-medium text-muted-foreground hover:text-foreground gap-1"
          >
            Fecha
            <ArrowDown className="h-3 w-3" />
          </Button>
        </th>
        <th className="p-4 text-left text-sm font-medium text-muted-foreground">Descripción</th>
        <th className="p-4 text-left text-sm font-medium text-muted-foreground">Monto</th>
        <th className="p-4 text-left text-sm font-medium text-muted-foreground">Categoría</th>
        <th className="p-4 text-left text-sm font-medium text-muted-foreground">Cuenta</th>
        <th className="p-4 text-left text-sm font-medium text-muted-foreground">Origen</th>
      </tr>
    </thead>
  )

  const Pagination = () => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <span className="text-sm text-muted-foreground">{transactions.length} transacciones</span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 text-sm text-foreground">
          Página {currentPage} de {totalPages || 1}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  if (!selectedAccountId) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Rocket className="h-4 w-4" />
                    Selecciona una cuenta para ver sus últimas transacciones
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No hay transacciones para esta cuenta
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 text-sm text-foreground capitalize">{formatDate(transaction.date)}</td>
                  <td className="p-4 text-sm text-foreground">{transaction.description}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        transaction.type === "expense" ? "text-red-500" : "text-green-500",
                      )}
                    >
                      {transaction.type === "expense" ? "-" : ""}
                      {formatCurrency(transaction.amount)}
                      <span className="ml-1 text-xs text-muted-foreground">{transaction.currency}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    {transaction.category ? (
                      <Badge variant="secondary" className="gap-1.5 bg-secondary/80 text-foreground font-normal">
                        {transaction.category.icon && <span>{transaction.category.icon}</span>}
                        {transaction.category.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {transaction.account ? (
                      <div className="flex items-center gap-2">
                        {renderAccountIcon(transaction.account)}
                        <span className="text-sm text-foreground">{transaction.account.name}</span>
                      </div>
                    ) : selectedAccount ? (
                      <div className="flex items-center gap-2">
                        {renderAccountIcon(selectedAccount)}
                        <span className="text-sm text-foreground">{selectedAccount.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4 text-center">{getOriginIcon(transaction.origin)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {transactions.length > 0 && <Pagination />}
    </div>
  )
}
