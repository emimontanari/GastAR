"use client";

import { MoreVertical, Edit, Trash2, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Account } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AccountCardProps {
  account: Account;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onDuplicate?: () => void;
}

export function AccountCard({
  account,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
}: AccountCardProps) {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    return formatted;
  };

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
      );
    }
    if (account.icon) {
      return <span className="text-xl">{account.icon}</span>;
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <span className="text-sm font-medium">
          {account.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "border-2 rounded-xl p-5 w-96 bg-[#1f1f1f] min-h-[200px] flex flex-col justify-between cursor-pointer transition-all",
        isSelected
          ? "border-primary"
          : "border-[#1f1f1f] hover:border-gray-700",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {renderAccountIcon()}
          <span className="font-medium text-sm text-foreground">
            {account.name}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-baseline gap-2 mt-auto">
        <span
          className={cn(
            "text-sm font-semibold",
            account.balance < 0 ? "text-[#ef575c]" : "text-[#4adec0]",
          )}
        >
          {account.balance < 0 ? "-" : ""}
          {formatCurrency(account.balance)}
        </span>
        <span className="text-gray-400 text-sm">{account.currency}</span>
      </div>
    </div>
  );
}
