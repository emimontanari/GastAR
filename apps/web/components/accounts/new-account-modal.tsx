"use client";

import type React from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2, ChevronDown, Search, ImageIcon, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Bank icons from Gasti CDN
const BANK_ICONS = [
  {
    id: "banco-bica",
    name: "Banco Bica",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-bica.svg",
  },
  {
    id: "banco-ciudad",
    name: "Banco Ciudad",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-ciudad.svg",
  },
  {
    id: "banco-coinag",
    name: "Banco Coinag",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-coinag.svg",
  },
  {
    id: "banco-columbia",
    name: "Banco Columbia",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-columbia.svg",
  },
  {
    id: "banco-comafi",
    name: "Banco Comafi",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-comafi.svg",
  },
  {
    id: "banco-credicoop",
    name: "Banco Credicoop",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-credicoop.svg",
  },
  {
    id: "banco-del-sol",
    name: "Banco del Sol",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-del-sol.svg",
  },
  {
    id: "banco-galicia",
    name: "Banco Galicia",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-galicia.svg",
  },
  {
    id: "banco-hipotecario",
    name: "Banco Hipotecario",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-hipotecario.svg",
  },
  {
    id: "banco-hsbc",
    name: "HSBC",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-hsbc.svg",
  },
  {
    id: "banco-icbc",
    name: "ICBC",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-icbc.svg",
  },
  {
    id: "banco-industrial",
    name: "Banco Industrial",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-industrial.svg",
  },
  {
    id: "banco-itau",
    name: "Banco Itaú",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-itau.svg",
  },
  {
    id: "banco-macro",
    name: "Banco Macro",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-macro.svg",
  },
  {
    id: "banco-nacion",
    name: "Banco Nación",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-nacion.svg",
  },
  {
    id: "banco-patagonia",
    name: "Banco Patagonia",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-patagonia.svg",
  },
  {
    id: "banco-piano",
    name: "Banco Piano",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-piano.svg",
  },
  {
    id: "banco-provincia",
    name: "Banco Provincia",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-provincia.svg",
  },
  {
    id: "banco-roela",
    name: "Banco Roela",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-roela.svg",
  },
  {
    id: "banco-santander",
    name: "Santander",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-santander.svg",
  },
  {
    id: "banco-supervielle",
    name: "Supervielle",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/banco-supervielle.svg",
  },
  {
    id: "bbva",
    name: "BBVA",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/bbva.svg",
  },
  {
    id: "brubank",
    name: "Brubank",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/brubank.svg",
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/mercadopago.svg",
  },
  {
    id: "naranja-x",
    name: "Naranja X",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/naranja-x.svg",
  },
  {
    id: "uala",
    name: "Ualá",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/uala.svg",
  },
  {
    id: "prex",
    name: "Prex",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/prex.svg",
  },
  {
    id: "personal-pay",
    name: "Personal Pay",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/personal-pay.svg",
  },
  {
    id: "modo",
    name: "MODO",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/modo.svg",
  },
  {
    id: "lemon",
    name: "Lemon",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/lemon.svg",
  },
  {
    id: "belo",
    name: "Belo",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/belo.svg",
  },
  {
    id: "cocos",
    name: "Cocos Capital",
    url: "https://xfagddrtglhdusqwxghx.supabase.co/storage/v1/object/public/cdn//banks/cocos.svg",
  },
];

// Common emojis for accounts
const ACCOUNT_EMOJIS = [
  "💰",
  "💳",
  "🏦",
  "💵",
  "💴",
  "💶",
  "💷",
  "🪙",
  "💎",
  "📊",
  "📈",
  "🏠",
  "🚗",
  "✈️",
  "🎮",
  "📱",
  "💻",
  "🛒",
  "🍔",
  "☕",
  "🎬",
  "🎵",
  "📚",
  "💊",
  "🏥",
  "🎓",
  "👔",
  "👗",
  "💄",
  "🏋️",
];

export function NewAccountModal({ open, onOpenChange }: NewAccountModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [currency, setCurrency] = useState("ARS-OFI");
  const [initialBalance, setInitialBalance] = useState("");
  const [displayBalance, setDisplayBalance] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [createInitialTransaction, setCreateInitialTransaction] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string>("");
  const [balanceError, setBalanceError] = useState<string>("");
  const [iconSearch, setIconSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<{
    type: "bank" | "emoji";
    value: string;
    url?: string;
  } | null>(null);
  const [iconPopoverOpen, setIconPopoverOpen] = useState(false);

  const filteredBanks = BANK_ICONS.filter((bank) =>
    bank.name.toLowerCase().includes(iconSearch.toLowerCase()),
  );

  const filteredEmojis = ACCOUNT_EMOJIS.filter(
    (emoji) => iconSearch === "" || emoji.includes(iconSearch),
  );

  const formatBalance = (value: string) => {
    // Remove all non-digit characters except minus sign
    const cleanValue = value.replace(/[^\d-]/g, "");

    if (cleanValue === "" || cleanValue === "-") {
      return cleanValue;
    }

    // Parse the number
    const number = Number.parseFloat(cleanValue);
    if (Number.isNaN(number)) {
      return "";
    }

    // Format with thousand separators
    const isNegative = number < 0;
    const absoluteValue = Math.abs(number);
    const formatted = new Intl.NumberFormat("de-DE").format(absoluteValue);

    return isNegative ? `-${formatted}` : formatted;
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty, minus sign, and numbers
    if (value === "" || value === "-") {
      setInitialBalance(value);
      setDisplayBalance(value);
      return;
    }

    // Remove all non-digit characters except minus sign
    const cleanValue = value.replace(/[^\d-]/g, "");
    const number = Number.parseFloat(cleanValue);

    if (!Number.isNaN(number)) {
      setInitialBalance(cleanValue);
      setDisplayBalance(formatBalance(cleanValue));
    }
  };

  const getBalanceColor = () => {
    if (!initialBalance || initialBalance === "-") return "";
    const number = Number.parseFloat(initialBalance);
    if (Number.isNaN(number) || number === 0) return "";
    return number > 0 ? "text-[#4adec0]" : "text-[#ef575c]";
  };

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setNameError("El nombre de la cuenta es obligatorio");
      return false;
    }
    if (value.trim().length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    if (value.trim().length > 50) {
      setNameError("El nombre no puede exceder 50 caracteres");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateBalance = (value: string): boolean => {
    if (value && value !== "-") {
      const number = Number.parseFloat(value);
      if (Number.isNaN(number)) {
        setBalanceError("Ingresa un monto válido");
        return false;
      }
    }
    setBalanceError("");
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (nameError) validateName(value);
  };

  const handleBalanceBlur = () => {
    validateBalance(initialBalance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const isNameValid = validateName(name);
    const isBalanceValid = validateBalance(initialBalance);

    if (!isNameValid || !isBalanceValid) {
      return;
    }

    setIsLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No estás autenticado");
      toast.error("Error de autenticación", {
        description: "No se pudo verificar tu sesión. Por favor, inicia sesión nuevamente."
      });
      setIsLoading(false);
      return;
    }

    const parsedCurrency = currency.split("-")[0]; // Extract ARS or USD from ARS-OFI

    const { error: insertError, data: newAccount } = await supabase
      .from("accounts")
      .insert({
        user_id: user.id,
        name,
        type: accountType || "bank",
        currency: parsedCurrency,
        balance: initialBalance ? Number.parseFloat(initialBalance) : 0,
        icon: selectedIcon
          ? selectedIcon.type === "bank"
            ? selectedIcon.url
            : selectedIcon.value
          : null,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      toast.error("Error al crear cuenta", {
        description: "No se pudo crear la cuenta. Por favor, intenta nuevamente."
      });
      setIsLoading(false);
      return;
    }

    // Create initial balance transaction if requested
    if (
      createInitialTransaction &&
      initialBalance &&
      Number.parseFloat(initialBalance) !== 0 &&
      newAccount
    ) {
      await supabase.from("transactions").insert({
        user_id: user.id,
        account_id: newAccount.id,
        description: "Saldo inicial",
        amount: Math.abs(Number.parseFloat(initialBalance)),
        type: Number.parseFloat(initialBalance) >= 0 ? "income" : "expense",
        currency: parsedCurrency,
        date: new Date().toISOString().split("T")[0],
        origin: "manual",
      });
    }

    setIsLoading(false);
    toast.success("Cuenta creada exitosamente", {
      description: `La cuenta "${name}" ha sido creada correctamente.`
    });
    onOpenChange(false);
    resetForm();
    router.refresh();
  };

  const resetForm = () => {
    setName("");
    setAccountType("");
    setCurrency("ARS-OFI");
    setInitialBalance("");
    setDisplayBalance("");
    setAccountNumber("");
    setCreateInitialTransaction(false);
    setSelectedIcon(null);
    setIconSearch("");
    setError(null);
    setNameError("");
    setBalanceError("");
  };

  const handleSelectIcon = (
    type: "bank" | "emoji",
    value: string,
    url?: string,
  ) => {
    setSelectedIcon({ type, value, url });
    setIconPopoverOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            Nueva cuenta
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Crea una nueva cuenta para organizar tus transacciones
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          {/* Icon Selector */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Icono</Label>
            <Popover open={iconPopoverOpen} onOpenChange={setIconPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between bg-secondary border-primary/50 hover:bg-secondary/80 h-11",
                    !selectedIcon && "text-muted-foreground",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {selectedIcon ? (
                      selectedIcon.type === "bank" ? (
                        <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                          <img
                            src={selectedIcon.url || "/placeholder.svg"}
                            alt=""
                            className="w-5 h-5"
                          />
                        </div>
                      ) : (
                        <span className="text-xl">{selectedIcon.value}</span>
                      )
                    ) : null}
                    <span>
                      {selectedIcon
                        ? selectedIcon.type === "bank"
                          ? selectedIcon.value
                          : "Emoji seleccionado"
                        : "Buscar icono o emoji..."}
                    </span>
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[400px] p-0 bg-card border-border"
                align="start"
              >
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar icono o emoji..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="pl-9 bg-secondary border-border"
                    />
                  </div>
                </div>
                <Tabs defaultValue="icons" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                    <TabsTrigger
                      value="icons"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Iconos
                    </TabsTrigger>
                    <TabsTrigger
                      value="emojis"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 gap-2"
                    >
                      <Smile className="h-4 w-4" />
                      Emojis
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="icons" className="p-3">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Bancos
                    </h3>
                    <ScrollArea className="h-[300px] w-full rounded-md">
                      <div className="grid grid-cols-5 gap-2 pr-4">
                        {filteredBanks.map((bank) => (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() =>
                              handleSelectIcon("bank", bank.name, bank.url)
                            }
                            className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors",
                              selectedIcon?.url === bank.url &&
                                "ring-2 ring-primary",
                            )}
                          >
                            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center p-1">
                              <img
                                src={bank.url || "/placeholder.svg"}
                                alt={bank.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="emojis" className="p-3">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Emojis
                    </h3>
                    <ScrollArea className="h-[300px] w-full rounded-md">
                      <div className="grid grid-cols-6 gap-2 pr-4">
                        {filteredEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleSelectIcon("emoji", emoji)}
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-xl",
                              selectedIcon?.value === emoji &&
                                "ring-2 ring-primary",
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          </div>

          {/* Account Name */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">
              Nombre de la cuenta <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Ej: Tarjeta de crédito principal"
              value={name}
              onChange={handleNameChange}
              onBlur={() => validateName(name)}
              className={cn(
                "bg-secondary border-border h-11",
                nameError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {nameError && (
              <p className="text-sm text-destructive">{nameError}</p>
            )}
          </div>

          {/* Initial Balance */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Balance inicial</Label>
            <Input
              type="text"
              placeholder="0"
              value={displayBalance}
              onChange={handleBalanceChange}
              onBlur={handleBalanceBlur}
              className={cn(
                "bg-secondary border-border h-11 font-semibold",
                getBalanceColor(),
                balanceError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {balanceError && (
              <p className="text-sm text-destructive">{balanceError}</p>
            )}
          </div>

          {/* Create Initial Transaction Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="createTransaction"
              checked={createInitialTransaction}
              onCheckedChange={(checked) =>
                setCreateInitialTransaction(checked as boolean)
              }
              className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor="createTransaction"
              className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1"
            >
              Crear transacción del saldo inicial
              <span className="text-muted-foreground/60">ⓘ</span>
            </Label>
          </div>

          {/* Currency */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Moneda</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-secondary border-border h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARS-OFI">🇦🇷 ARS</SelectItem>
                <SelectItem value="USD">🇺🇸 USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Number (Optional) */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">
              Número de cuenta (opcional)
            </Label>
            <Input
              placeholder="Ej: **** 1234"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="bg-secondary border-border h-11"
            />
          </div>

          {/* Account Type (Optional) */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">
              Tipo de cuenta (opcional)
            </Label>
            <Input
              placeholder="Ej: Tarjeta de crédito, Cuenta corriente"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="bg-secondary border-border h-11"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="bg-secondary hover:bg-secondary/80"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || !name}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
