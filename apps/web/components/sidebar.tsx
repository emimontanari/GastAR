"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Bot,
  LayoutDashboard,
  ArrowRightLeft,
  Wallet,
  PiggyBank,
  Target,
  Users,
  Wrench,
  ChevronDown,
  Sparkles,
  Gift,
  Download,
  LogOut,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  label: string
  href?: string
  icon: React.ReactNode
  badge?: string
  disabled?: boolean
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: "Asistente", href: "/assistant", icon: <Bot className="h-4 w-4" /> },
  { label: "Panel", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  {
    label: "Transacciones",
    icon: <ArrowRightLeft className="h-4 w-4" />,
    children: [
      { label: "Todas", href: "/transactions" },
      { label: "Ingresos", href: "/transactions?type=income" },
      { label: "Gastos", href: "/transactions?type=expense" },
    ],
  },
  { label: "Cuentas", href: "/accounts", icon: <Wallet className="h-4 w-4" /> },
  { label: "Presupuestos", href: "/budgets", icon: <PiggyBank className="h-4 w-4" /> },
  { label: "Metas", href: "/goals", icon: <Target className="h-4 w-4" /> },
  { label: "Grupos", href: "/groups", icon: <Users className="h-4 w-4" />, badge: "Pronto", disabled: true },
  {
    label: "Herramientas",
    icon: <Wrench className="h-4 w-4" />,
    children: [
      { label: "Importar", href: "/tools/import" },
      { label: "Exportar", href: "/tools/export" },
      { label: "Categorías", href: "/tools/categories" },
    ],
  },
]

interface SidebarProps {
  user?: {
    email?: string
    full_name?: string
  } | null
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const getInitials = (email?: string, name?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">G</span>
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">Gasti</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) =>
            item.children ? (
              <li key={item.label}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                        item.disabled && "opacity-50 cursor-not-allowed",
                      )}
                      disabled={item.disabled}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-40">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link href={child.href}>{child.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                    pathname === item.href && "bg-sidebar-accent text-sidebar-primary",
                    item.disabled && "opacity-50 pointer-events-none",
                  )}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      {/* Upgrade Card */}
      <div className="mx-3 mb-3 rounded-lg border border-sidebar-border bg-card p-3">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Mejorá tu plan</span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">Más poder, más control, más libertad en tus finanzas.</p>
        <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Crown className="mr-2 h-3 w-3" />
          Sube a Premium
        </Button>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-sidebar-border p-3">
        <div className="mb-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent border-sidebar-border text-sidebar-foreground text-xs"
          >
            <Gift className="mr-1 h-3 w-3" />
            Invitar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent border-sidebar-border text-sidebar-foreground text-xs"
          >
            <Download className="mr-1 h-3 w-3" />
            App
          </Button>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-sidebar-accent">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {getInitials(user?.email, user?.full_name)}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.full_name || user?.email?.split("@")[0] || "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/settings">Configuración</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
