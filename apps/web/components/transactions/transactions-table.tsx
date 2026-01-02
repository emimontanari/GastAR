"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowDown, ChevronRight, MoreVertical, Monitor, Smartphone, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Transaction, Account } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TransactionsTableProps {
  transactions: Transaction[]
  accounts?: Account[]
  onUpdateTransaction?: (id: string, accountId: string | null) => void
}

export function TransactionsTable({ transactions, accounts = [], onUpdateTransaction }: TransactionsTableProps) {
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [accountPopoverOpen, setAccountPopoverOpen] = useState<string | null>(null)
  const itemsPerPage = 20

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case "description":
        comparison = a.description.localeCompare(b.description)
        break
      case "amount":
        comparison = a.amount - b.amount
        break
      default:
        comparison = 0
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  const paginatedTransactions = sortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedTransactions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedTransactions.map((t) => t.id)))
    }
  }

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    const formatted = absAmount.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formatted
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = format(date, "MMM", { locale: es })
    const day = format(date, "d")
    // Capitalize first letter
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}`
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

  const getCurrencyFlag = (currency: string) => {
    if (currency.startsWith("ARS")) return "🇦🇷"
    if (currency.startsWith("USD")) return "🇺🇸"
    return ""
  }

  const handleAccountChange = (transactionId: string, accountId: string | null) => {
    if (onUpdateTransaction) {
      onUpdateTransaction(transactionId, accountId)
    }
    setAccountPopoverOpen(null)
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="w-10 p-4">
                <Checkbox
                  checked={selectedIds.size === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 text-left">
                <button
                  className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-foreground/80"
                  onClick={() => handleSort("date")}
                >
                  Fecha
                  <ArrowDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-4 text-left text-sm font-medium text-foreground">Descripción</th>
              <th className="p-4 text-left text-sm font-medium text-foreground">Monto</th>
              <th className="p-4 text-left text-sm font-medium text-foreground">Categoría</th>
              <th className="p-4 text-left text-sm font-medium text-foreground">Cuenta</th>
              <th className="p-4 text-left text-sm font-medium text-foreground">Origen</th>
              <th className="w-10 p-4" />
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No hay transacciones para mostrar
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4">
                    <Checkbox
                      checked={selectedIds.has(transaction.id)}
                      onCheckedChange={() => toggleSelect(transaction.id)}
                    />
                  </td>
                  <td className="p-4 text-sm text-foreground">{formatDate(transaction.date)}</td>
                  <td className="p-4 text-sm text-foreground">{transaction.description}</td>
                  <td className="p-4">
                    <span className={cn("text-sm", transaction.type === "expense" ? "text-red-500" : "text-green-500")}>
                      {transaction.type === "expense" ? "-" : ""}
                      {formatCurrency(transaction.amount)}{" "}
                      <span className="text-muted-foreground">{transaction.currency}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    {transaction.category ? (
                      <Badge
                        variant="secondary"
                        className="gap-1.5 bg-[#2a2a2a] text-foreground border-0 font-normal px-2.5 py-1"
                      >
                        {transaction.category.icon && <span>{transaction.category.icon}</span>}
                        {transaction.category.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {transaction.account ? (
                        <>
                          {transaction.account.icon ? (
                            transaction.account.icon.startsWith("http") ? (
                              <img
                                src={transaction.account.icon || "/placeholder.svg"}
                                alt={transaction.account.name}
                                className="h-5 w-5 rounded-full object-contain"
                              />
                            ) : (
                              <span className="text-base">{transaction.account.icon}</span>
                            )
                          ) : null}
                          <span className="text-sm text-foreground">{transaction.account.name}</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                      <Popover
                        open={accountPopoverOpen === transaction.id}
                        onOpenChange={(open) => setAccountPopoverOpen(open ? transaction.id : null)}
                      >
                        <PopoverTrigger asChild>
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-4 bg-[#1a1a1a] border-border/50" align="start">
                          <h4 className="font-semibold text-foreground mb-3">Seleccionar Cuenta</h4>
                          <Select
                            value={transaction.account_id || "none"}
                            onValueChange={(value) =>
                              handleAccountChange(transaction.id, value === "none" ? null : value)
                            }
                          >
                            <SelectTrigger className="bg-[#2a2a2a] border-border/50">
                              <SelectValue placeholder="Sin cuenta" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2a2a] border-border/50">
                              <SelectItem value="none" className="hover:bg-secondary/50">
                                <div className="flex items-center justify-between w-full">
                                  <span>Sin cuenta</span>
                                  {!transaction.account_id && <Check className="h-4 w-4 ml-2" />}
                                </div>
                              </SelectItem>
                              {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id} className="hover:bg-secondary/50">
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {account.name} ({account.currency} {getCurrencyFlag(account.currency)})
                                    </span>
                                    {transaction.account_id === account.id && <Check className="h-4 w-4 ml-2" />}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </td>
                  <td className="p-4">{getOriginIcon(transaction.origin)}</td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-border/50">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
        <span className="text-sm text-muted-foreground">{transactions.length} transacciones</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            {"«"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            {"‹"}
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Página {currentPage} de {totalPages || 1}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            {"›"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            {"»"}
          </Button>
        </div>
      </div>
    </div>
  )
}
