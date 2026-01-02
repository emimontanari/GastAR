"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Lock, Loader2, Plus, Trash2, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Category, Account } from "@/lib/types"
import { cn } from "@/lib/utils"

const PREDEFINED_CATEGORIES = [
  { id: "ahorros", name: "Ahorros", icon: "💰", isDefault: true },
  { id: "auto", name: "Auto", icon: "🚗", isDefault: true },
  { id: "combustible", name: "Combustible", icon: "⛽", isDefault: true },
  { id: "comida", name: "Comida", icon: "🍽️", isDefault: true },
  { id: "compras", name: "Compras", icon: "🛒", isDefault: true },
  { id: "delivery", name: "Delivery", icon: "🛵", isDefault: true },
  { id: "educacion", name: "Educación", icon: "📚", isDefault: true },
  { id: "entretenimiento", name: "Entretenimiento", icon: "🎬", isDefault: true },
  { id: "gimnasio", name: "Gimnasio", icon: "💪", isDefault: true },
  { id: "hogar", name: "Hogar", icon: "🏠", isDefault: true },
  { id: "impuestos", name: "Impuestos", icon: "📋", isDefault: true },
  { id: "inversiones", name: "Inversiones", icon: "📈", isDefault: true },
  { id: "mascota", name: "Mascota", icon: "🐕", isDefault: true },
  { id: "regalos", name: "Regalos", icon: "🎁", isDefault: true },
  { id: "ropa", name: "Ropa", icon: "👕", isDefault: true },
  { id: "salud", name: "Salud", icon: "💊", isDefault: true },
  { id: "salario", name: "Salario", icon: "💵", isDefault: true },
  { id: "saldo-inicial", name: "Saldo inicial", icon: "💰", isDefault: true },
  { id: "servicios", name: "Servicios", icon: "💡", isDefault: true },
  { id: "streaming", name: "Streaming", icon: "📺", isDefault: true },
  { id: "suscripciones", name: "Suscripciones", icon: "🔄", isDefault: true },
  { id: "tecnologia", name: "Tecnología", icon: "💻", isDefault: true },
  { id: "trabajo", name: "Trabajo", icon: "💼", isDefault: true },
  { id: "transporte", name: "Transporte", icon: "🚌", isDefault: true },
  { id: "vacaciones", name: "Vacaciones", icon: "✈️", isDefault: true },
  { id: "vivienda", name: "Vivienda", icon: "🏡", isDefault: true },
]

const CATEGORY_EMOJIS = ["🏠", "🪙", "🎪", "🏢", "🍔", "☕", "🎮", "🏋️", "✈️", "🎁", "💊", "📱", "🛒", "🚗", "💼", "📚"]

interface NewTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  accounts: Account[]
}

function formatAmountWithSeparators(value: string): string {
  // Remove all non-numeric characters except comma for decimals
  const numericValue = value.replace(/[^\d]/g, "")
  if (!numericValue) return ""

  // Add dots as thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function parseFormattedAmount(value: string): number {
  // Remove dots and replace comma with dot for parsing
  const cleanValue = value.replace(/\./g, "").replace(",", ".")
  return Number.parseFloat(cleanValue) || 0
}

export function NewTransactionModal({ open, onOpenChange, categories, accounts }: NewTransactionModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("transaction")

  // Form state
  const [date, setDate] = useState<Date>(new Date())
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [displayAmount, setDisplayAmount] = useState("")
  const [currency, setCurrency] = useState("ARS")
  const [categoryId, setCategoryId] = useState<string>("")
  const [accountId, setAccountId] = useState<string>("")
  const [type, setType] = useState<"expense" | "income">("expense")
  const [isRecurring, setIsRecurring] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("🏠")
  const [userCategories, setUserCategories] = useState<Category[]>([])
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  useEffect(() => {
    const loadUserCategories = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from("categories").select("*").eq("user_id", user.id).order("name")

      if (data) {
        setUserCategories(data)
      }
    }
    if (open) {
      loadUserCategories()
    }
  }, [open])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formatted = formatAmountWithSeparators(rawValue)
    setDisplayAmount(formatted)
    setAmount(rawValue.replace(/[^\d]/g, ""))
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsCreatingCategory(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsCreatingCategory(false)
      return
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        user_id: user.id,
        name: newCategoryName.trim(),
        icon: newCategoryEmoji,
        color: "#CCFF00",
      })
      .select()
      .single()

    if (data) {
      setUserCategories([...userCategories, data])
      setCategoryId(data.id)
      setShowNewCategoryForm(false)
      setNewCategoryName("")
      setNewCategoryEmoji("🏠")
    }
    setIsCreatingCategory(false)
  }

  const handleDeleteCategory = async (catId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const supabase = createClient()
    await supabase.from("categories").delete().eq("id", catId)
    setUserCategories(userCategories.filter((c) => c.id !== catId))
    if (categoryId === catId) {
      setCategoryId("")
    }
  }

  const filteredPredefined = PREDEFINED_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()),
  )
  const filteredUserCategories = userCategories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()),
  )

  const getSelectedCategoryDisplay = () => {
    const userCat = userCategories.find((c) => c.id === categoryId)
    if (userCat) return { name: userCat.name, icon: userCat.icon }

    const predefinedCat = PREDEFINED_CATEGORIES.find((c) => c.id === categoryId)
    if (predefinedCat) return { name: predefinedCat.name, icon: predefinedCat.icon }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("No estás autenticado")
      setIsLoading(false)
      return
    }

    if (!description || !amount) {
      setError("Por favor completa los campos requeridos")
      setIsLoading(false)
      return
    }

    const parsedAmount = parseFormattedAmount(displayAmount || amount)
    const transactionAmount = type === "expense" ? -Math.abs(parsedAmount) : Math.abs(parsedAmount)

    let actualCategoryId: string | null = null
    if (categoryId && !PREDEFINED_CATEGORIES.find((c) => c.id === categoryId)) {
      actualCategoryId = categoryId
    }

    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: user.id,
      date: format(date, "yyyy-MM-dd"),
      description,
      amount: parsedAmount,
      currency,
      category_id: actualCategoryId,
      category_name: getSelectedCategoryDisplay()?.name || null,
      category_icon: getSelectedCategoryDisplay()?.icon || null,
      account_id: accountId && accountId !== "none" ? accountId : null,
      type,
      is_recurring: isRecurring,
      origin: "manual",
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    // Update account balance if account is selected
    if (accountId && accountId !== "none") {
      const selectedAccount = accounts.find((a) => a.id === accountId)
      if (selectedAccount) {
        const newBalance = selectedAccount.balance + transactionAmount
        await supabase.from("accounts").update({ balance: newBalance }).eq("id", accountId)
      }
    }

    setIsLoading(false)
    onOpenChange(false)
    resetForm()
    router.refresh()
  }

  const resetForm = () => {
    setDate(new Date())
    setDescription("")
    setAmount("")
    setDisplayAmount("")
    setCurrency("ARS")
    setCategoryId("")
    setAccountId("")
    setType("expense")
    setIsRecurring(false)
    setError(null)
    setCategorySearch("")
    setShowNewCategoryForm(false)
  }

  const selectedCategory = getSelectedCategoryDisplay()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">Nueva Transacción</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Agrega una nueva transacción o inversión a tu cuenta
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-secondary/50 p-1 rounded-lg">
            <TabsTrigger
              value="transaction"
              className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-foreground rounded-md"
            >
              Transacciones
            </TabsTrigger>
            <TabsTrigger
              value="investment"
              className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-foreground rounded-md"
              disabled
            >
              Inversiones
              <Badge variant="outline" className="ml-2 text-[10px] bg-muted">
                Pronto
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transaction" className="mt-6">
            <div className="flex gap-8">
              {/* Left side - Receipt upload (Pro feature) */}
              <div className="w-56 shrink-0">
                <p className="mb-3 text-sm text-muted-foreground">Comprobante (opcional)</p>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-primary/30 bg-card p-8 text-center min-h-[280px]">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mb-1 text-base font-medium text-foreground">Función Pro</p>
                  <p className="mb-4 text-sm text-muted-foreground">Sube comprobantes con el plan Pro o Premium</p>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white border-0">
                    Mejorar plan
                  </Button>
                </div>
              </div>

              {/* Right side - Form */}
              <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                {/* Date */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <Label className="text-right text-muted-foreground">Fecha</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-secondary border-0 h-11",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Description */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <Label className="text-right text-muted-foreground">Descripción</Label>
                  <Input
                    placeholder="Descripción de la transacción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="bg-secondary border-0 h-11"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <Label className="text-right text-muted-foreground">Monto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={displayAmount}
                      onChange={handleAmountChange}
                      required
                      className="flex-1 bg-white text-black border-0 h-11 text-right font-medium"
                    />
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-36 bg-secondary border-0 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARS">🇦🇷 ARS-OFI</SelectItem>
                        <SelectItem value="ARS-MEP">🇦🇷 ARS-MEP</SelectItem>
                        <SelectItem value="ARS-BLUE">🇦🇷 ARS-BLUE</SelectItem>
                        <SelectItem value="USD">🇺🇸 USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <Label className="text-right text-muted-foreground">Categoría</Label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className="w-full justify-between bg-secondary border-0 h-11 font-normal"
                      >
                        {selectedCategory ? (
                          <span className="flex items-center gap-2">
                            <span>{selectedCategory.icon}</span>
                            <span>{selectedCategory.name}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Seleccionar categoría</span>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0" align="start">
                      {showNewCategoryForm ? (
                        <div className="p-4 space-y-4">
                          <h4 className="font-semibold">Crear nueva categoría</h4>

                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Seleccionar Emoji</Label>
                            <div className="flex flex-wrap gap-2">
                              {CATEGORY_EMOJIS.slice(0, 4).map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => setNewCategoryEmoji(emoji)}
                                  className={cn(
                                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                                    newCategoryEmoji === emoji
                                      ? "bg-primary/20 ring-2 ring-primary"
                                      : "bg-secondary hover:bg-secondary/80",
                                  )}
                                >
                                  {emoji}
                                </button>
                              ))}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                                  >
                                    <Plus className="h-5 w-5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-2" align="start">
                                  <div className="grid grid-cols-6 gap-1">
                                    {CATEGORY_EMOJIS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setNewCategoryEmoji(emoji)}
                                        className={cn(
                                          "w-8 h-8 rounded text-lg flex items-center justify-center hover:bg-secondary",
                                          newCategoryEmoji === emoji && "bg-primary/20",
                                        )}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Nombre de la categoría</Label>
                            <Input
                              placeholder="Ej: Comida rápida"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              className="bg-secondary border-0"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setShowNewCategoryForm(false)
                                setNewCategoryName("")
                                setNewCategoryEmoji("🏠")
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="button"
                              onClick={handleCreateCategory}
                              disabled={!newCategoryName.trim() || isCreatingCategory}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              {isCreatingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="max-h-[350px] overflow-y-auto">
                          <div className="p-2">
                            <Input
                              placeholder='Buscar categoría... (ej: "casa" para encontrar "Vivienda")'
                              value={categorySearch}
                              onChange={(e) => setCategorySearch(e.target.value)}
                              className="bg-background border"
                            />
                          </div>

                          {/* Create new category button */}
                          <div className="border-b border-border/50">
                            <button
                              type="button"
                              onClick={() => setShowNewCategoryForm(true)}
                              className="w-full flex items-center text-primary gap-3 px-3 py-2 text-sm hover:bg-primary/5 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Crear nueva categoría</span>
                            </button>
                          </div>

                          {/* User created categories */}
                          {filteredUserCategories.length > 0 && (
                            <div>
                              <div className="px-3 py-2 border-b border-border/50">
                                <h3 className="font-semibold text-sm">Creadas</h3>
                              </div>
                              {filteredUserCategories.map((cat) => (
                                <div
                                  key={cat.id}
                                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors group"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCategoryId(cat.id)
                                      setCategoryOpen(false)
                                    }}
                                    className="flex items-center flex-1 text-left"
                                  >
                                    <span className="mr-2">{cat.icon}</span>
                                    {cat.name}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteCategory(cat.id, e)}
                                    className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 text-destructive hover:bg-destructive/10 rounded transition-all ml-2"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Predefined categories */}
                          <div>
                            <div className="px-3 py-2 border-b border-border/50">
                              <h3 className="font-semibold text-sm">Predeterminadas</h3>
                            </div>
                            {filteredPredefined.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setCategoryId(cat.id)
                                  setCategoryOpen(false)
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                              >
                                <span className="mr-2">{cat.icon}</span>
                                {cat.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Tags placeholder */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <Label className="text-right text-muted-foreground">Etiquetas</Label>
                  <Select disabled>
                    <SelectTrigger className="bg-secondary border-0 h-11">
                      <SelectValue placeholder="Seleccionar etiquetas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin etiquetas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <Label className="text-right text-muted-foreground">Tipo</Label>
                  <Select value={type} onValueChange={(v) => setType(v as "expense" | "income")}>
                    <SelectTrigger className="bg-secondary border-0 h-11">
                      <SelectValue>
                        {type === "expense" ? (
                          <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/20 border-0">Gasto</Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20 border-0">
                            Ingreso
                          </Badge>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">
                        <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/20 border-0">Gasto</Badge>
                      </SelectItem>
                      <SelectItem value="income">
                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20 border-0">Ingreso</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Recurring */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <Label className="text-right text-muted-foreground">Recurrente</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="recurring" className="cursor-pointer text-foreground">
                      Transacción recurrente
                    </Label>
                  </div>
                </div>

                {/* Account */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <Label className="text-right text-muted-foreground">Cuenta</Label>
                  <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger className="bg-secondary border-0 h-11">
                      <SelectValue placeholder="Sin cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin cuenta</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <span className="flex items-center gap-2">
                            {account.icon && (
                              <img src={account.icon || "/placeholder.svg"} alt="" className="w-4 h-4 rounded" />
                            )}
                            {account.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && <p className="text-sm text-destructive text-right">{error}</p>}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Transacción"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
