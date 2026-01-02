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
  Search,
  Filter,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [minAmount, setMinAmount] = useState<string>("")
  const [maxAmount, setMaxAmount] = useState<string>("")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
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

  // Get unique categories from transactions
  const uniqueCategories = Array.from(
    new Set(
      transactions
        .map((t) => t.category?.name)
        .filter((name): name is string => !!name)
    )
  )

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter
    if (selectedCategory !== "all" && transaction.category?.name !== selectedCategory) {
      return false
    }

    // Amount range filter
    if (minAmount && transaction.amount < Number.parseFloat(minAmount)) {
      return false
    }
    if (maxAmount && transaction.amount > Number.parseFloat(maxAmount)) {
      return false
    }

    // Date range filter
    if (dateFrom && transaction.date < dateFrom) {
      return false
    }
    if (dateTo && transaction.date > dateTo) {
      return false
    }

    return true
  })

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setMinAmount("")
    setMaxAmount("")
    setDateFrom("")
    setDateTo("")
    setCurrentPage(1)
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory !== "all" || minAmount || maxAmount || dateFrom || dateTo

  const TableHeaderComponent = () => (
    <TableHeader>
      <TableRow className="border-gray-700 hover:bg-transparent">
        <TableHead className="text-gray-400 font-normal">
          <div className="flex items-center gap-1">
            Fecha
            <ArrowDown className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-gray-400 font-normal">Descripción</TableHead>
        <TableHead className="text-gray-400 font-normal">Monto</TableHead>
        <TableHead className="text-gray-400 font-normal">Categoría</TableHead>
        <TableHead className="text-gray-400 font-normal">Cuenta</TableHead>
        <TableHead className="text-gray-400 font-normal">Origen</TableHead>
      </TableRow>
    </TableHeader>
  )

  const SearchAndFilters = () => (
    <div className="p-4 border-b border-gray-700 space-y-3">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por descripción..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              handleFilterChange()
            }}
            className="bg-secondary/50 border-border pl-9"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        {uniqueCategories.length > 0 && (
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger className="w-[180px] bg-secondary border-border">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Advanced Filters Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "bg-secondary border-border",
                (minAmount || maxAmount || dateFrom || dateTo) && "border-primary"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros avanzados
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-card border-border" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3">Rango de montos</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Mínimo</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minAmount}
                      onChange={(e) => {
                        setMinAmount(e.target.value)
                        handleFilterChange()
                      }}
                      className="bg-secondary border-border h-9"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Máximo</Label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={maxAmount}
                      onChange={(e) => {
                        setMaxAmount(e.target.value)
                        handleFilterChange()
                      }}
                      className="bg-secondary border-border h-9"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3">Rango de fechas</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Desde</Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value)
                        handleFilterChange()
                      }}
                      className="bg-secondary border-border h-9"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Hasta</Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value)
                        handleFilterChange()
                      }}
                      className="bg-secondary border-border h-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )

  const Pagination = () => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
      <span className="text-sm text-muted-foreground">
        {filteredTransactions.length} de {transactions.length} transacciones
      </span>
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
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeaderComponent />
          <TableBody>
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableCell colSpan={6} className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Rocket className="h-4 w-4" />
                  Selecciona una cuenta para ver sus últimas transacciones
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <SearchAndFilters />
      <Table>
        <TableHeaderComponent />
        <TableBody>
          {paginatedTransactions.length === 0 ? (
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
                {hasActiveFilters
                  ? "No se encontraron transacciones con los filtros aplicados"
                  : "No hay transacciones para esta cuenta"
                }
              </TableCell>
            </TableRow>
          ) : (
            paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-gray-700 hover:bg-gray-800/50">
                <TableCell className="text-gray-300 capitalize">{formatDate(transaction.date)}</TableCell>
                <TableCell className="text-gray-300">{transaction.description}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "font-medium",
                      transaction.type === "expense" ? "text-red-500" : "text-green-500",
                    )}
                  >
                    {transaction.type === "expense" ? "-" : ""}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <span className="text-gray-400 ml-1 text-sm">{transaction.currency}</span>
                </TableCell>
                <TableCell>
                  {transaction.category ? (
                    <Badge variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-700 font-normal">
                      {transaction.category.icon && <span className="mr-1">{transaction.category.icon}</span>}
                      {transaction.category.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.account ? (
                    <div className="flex items-center gap-2">
                      {renderAccountIcon(transaction.account)}
                      <span className="text-gray-300">{transaction.account.name}</span>
                    </div>
                  ) : selectedAccount ? (
                    <div className="flex items-center gap-2">
                      {renderAccountIcon(selectedAccount)}
                      <span className="text-gray-300">{selectedAccount.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">{getOriginIcon(transaction.origin)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {transactions.length > 0 && <Pagination />}
    </div>
  )
}
