"use client"

import { useState, useMemo } from "react"
import { MainHeader } from "@/components/main-header"
import { MobileNav } from "@/components/mobile-nav"
import { StatsCard } from "@/components/stats-card"
import { CurrencyBadge } from "@/components/currency-badge"
import { FilterChip } from "@/components/filter-chip"
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { NewTransactionModal } from "@/components/transactions/new-transaction-modal"
import { Button } from "@/components/ui/button"
import { Search, Filter, BarChart3, Settings, Zap, Plus, ChevronDown, Briefcase } from "lucide-react"
import type { Transaction, Category, Account } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TransactionsViewProps {
  initialTransactions: Transaction[]
  categories: Category[]
  accounts: Account[]
}

export function TransactionsView({ initialTransactions, categories, accounts }: TransactionsViewProps) {
  const [transactions] = useState(initialTransactions)
  const [selectedCurrency, setSelectedCurrency] = useState("ARS")
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState({
    startDate: "01/12/2025",
    endDate: "31/12/2025",
  })

  // Filter transactions by currency
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.currency === selectedCurrency)
  }, [transactions, selectedCurrency])

  // Calculate stats
  const stats = useMemo(() => {
    const filtered = filteredTransactions
    const expenses = filtered.filter((t) => t.type === "expense").reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const income = filtered.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const balance = income - expenses

    // Find top expense category
    const categoryExpenses: Record<string, { name: string; icon?: string; total: number }> = {}
    filtered
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const catId = t.category_id || "uncategorized"
        const catName = t.category?.name || "Sin categoría"
        const catIcon = t.category?.icon
        if (!categoryExpenses[catId]) {
          categoryExpenses[catId] = { name: catName, icon: catIcon, total: 0 }
        }
        categoryExpenses[catId].total += Math.abs(t.amount)
      })

    const topCategory = Object.values(categoryExpenses).sort((a, b) => b.total - a.total)[0]

    return {
      balance,
      expenses,
      income,
      topCategory: topCategory || null,
    }
  }, [filteredTransactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const currencies = ["ARS", "USD"]

  return (
    <div className="flex h-full flex-col">
      <MainHeader
        title="Transacciones"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="icon" className="bg-primary/20 text-primary hover:bg-primary/30">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Zap className="h-5 w-5 text-primary" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Nueva
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsNewTransactionOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva transacción
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <MobileNav />

      <div className="flex-1 overflow-y-auto p-4">
        {/* View Toggle */}
        <div className="mb-4 flex items-center gap-4">
          <Button variant="secondary" size="sm" className="gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Tabla
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterChip
            label={`Fecha está entre ${dateFilter.startDate} → ${dateFilter.endDate}`}
            onClick={() => {}}
            removable={false}
          />
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Plus className="mr-1 h-3 w-3" />
            Agregar filtro
          </Button>
        </div>

        {/* Currency Selector */}
        <div className="mb-4 flex gap-2">
          {currencies.map((currency) => (
            <CurrencyBadge
              key={currency}
              currency={currency}
              isActive={selectedCurrency === currency}
              onClick={() => setSelectedCurrency(currency)}
            />
          ))}
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Balance"
            value={stats.balance >= 0 ? formatCurrency(stats.balance) : `-${formatCurrency(stats.balance)}`}
            currency={selectedCurrency}
            variant={stats.balance >= 0 ? "positive" : "negative"}
          />
          <StatsCard
            label="Gastos"
            value={`-${formatCurrency(stats.expenses)}`}
            currency={selectedCurrency}
            variant="negative"
          />
          <StatsCard label="Ingresos" value={formatCurrency(stats.income)} currency={selectedCurrency} />
          <StatsCard
            label="Categoría con más gastos"
            value={stats.topCategory ? stats.topCategory.name : "Sin datos"}
            currency={selectedCurrency}
            icon={
              stats.topCategory ? (
                <span className="text-lg">{stats.topCategory.icon || <Briefcase className="h-5 w-5" />}</span>
              ) : null
            }
          />
        </div>

        {/* Transactions Table */}
        <TransactionsTable transactions={filteredTransactions} />
      </div>

      {/* New Transaction Modal */}
      <NewTransactionModal
        open={isNewTransactionOpen}
        onOpenChange={setIsNewTransactionOpen}
        categories={categories}
        accounts={accounts}
      />
    </div>
  )
}
