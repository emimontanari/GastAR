"use client"

import type React from "react"
import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MainHeaderProps {
  title: string
  onToggleSidebar?: () => void
  actions?: React.ReactNode
}

export function MainHeader({ title, onToggleSidebar, actions }: MainHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
        <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">
          Free
        </Badge>
      </div>
    </header>
  )
}
