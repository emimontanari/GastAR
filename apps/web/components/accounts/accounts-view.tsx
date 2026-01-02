"use client";

import { useState } from "react";
import { MainHeader } from "@/components/main-header";
import { MobileNav } from "@/components/mobile-nav";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountTransactionsTable } from "@/components/accounts/account-transactions-table";
import { NewAccountModal } from "@/components/accounts/new-account-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowRight,
  CreditCard,
  Clock,
  Plus,
} from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import type { Account, Transaction } from "@/lib/types";
import Image from "next/image";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AccountsViewProps {
  accounts: Account[];
  transactions: Transaction[];
}

export function AccountsView({ accounts, transactions }: AccountsViewProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedAccount = selectedAccountId
    ? accounts.find((a) => a.id === selectedAccountId)
    : null;

  const selectedAccountTransactions = selectedAccountId
    ? transactions.filter((t) => t.account_id === selectedAccountId)
    : [];

  const renderSelectedAccountBadge = () => {
    if (!selectedAccount) return null;

    return (
      <Badge
        variant="secondary"
        className="gap-2 bg-secondary/80 text-foreground font-normal px-3 py-1.5"
      >
        {selectedAccount.icon && selectedAccount.icon.startsWith("http") ? (
          <Image
            src={selectedAccount.icon || "/placeholder.svg"}
            alt={selectedAccount.name}
            width={20}
            height={20}
            className="h-5 w-5 rounded object-contain"
          />
        ) : selectedAccount.icon ? (
          <span>{selectedAccount.icon}</span>
        ) : null}
        {selectedAccount.name}
      </Badge>
    );
  };

  const EmptyState = () => (
    <div className="rounded-xl border border-border bg-card/50 p-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
          <CreditCard className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">
            Aún no tienes cuentas
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea tu primera cuenta para empezar a registrar tus movimientos
          </p>
        </div>
        <Button
          onClick={() => setIsNewAccountOpen(true)}
          className="mt-2 bg-transparent border border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear cuenta
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <MainHeader title="Cuentas" />
      <MobileNav />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Upgrade Banner */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-4 py-3">
          <p className="text-sm text-foreground flex items-center gap-2">
            <span className="text-primary">✨</span>
            Usa Gasti a otro nivel, hazte Pro{" "}
            <ArrowRight className="ml-1 inline h-4 w-4 text-primary" />
          </p>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex items-center justify-end gap-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cuentas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 border-border pl-9"
            />
          </div>
          <Button
            variant="secondary"
            className="bg-secondary text-foreground hover:bg-secondary/80 gap-2"
          >
            <span className="text-primary">🏷️</span>
            GasTag
          </Button>
          <ButtonGroup>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setIsNewAccountOpen(true)}
            >
              <IconPlus />
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant="secondary"
              onClick={() => setIsNewAccountOpen(true)}
            >
              Nueva cuenta
            </Button>
          </ButtonGroup>
        </div>

        {/* Accounts Section */}
        <div className="mb-8">
          {filteredAccounts.length === 0 ? (
            <EmptyState />
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full px-12"
            >
              <CarouselContent className="-ml-4">
                {filteredAccounts.map((account) => (
                  <CarouselItem key={account.id} className="pl-4 basis-auto">
                    <AccountCard
                      account={account}
                      isSelected={selectedAccountId === account.id}
                      onClick={() =>
                        setSelectedAccountId(
                          selectedAccountId === account.id ? null : account.id,
                        )
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          )}
        </div>

        {/* Transactions History - Updated with account badge */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Historial de cuentas
            </h2>
            {renderSelectedAccountBadge()}
          </div>
          <AccountTransactionsTable
            transactions={selectedAccountTransactions}
            selectedAccountId={selectedAccountId}
            selectedAccount={selectedAccount}
          />
        </div>
      </div>

      <NewAccountModal
        open={isNewAccountOpen}
        onOpenChange={setIsNewAccountOpen}
      />
    </div>
  );
}
