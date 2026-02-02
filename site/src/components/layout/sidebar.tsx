"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Settings, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

interface SidebarProps {
  items: SidebarItem[]
  activeHref?: string
  className?: string
  logoHref?: string
  onSettingsClick?: () => void
  onLogoutClick?: () => void
}

function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: SidebarItem
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center">
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-full text-xs font-semibold",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-primary/10 text-primary"
          )}
        >
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  )
}

function SidebarContent({
  items,
  activeHref,
  logoHref = "/dashboard",
  onSettingsClick,
  onLogoutClick,
  onItemClick,
}: SidebarProps & { onItemClick?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        <Link href={logoHref} className="flex items-center">
          <span className="text-xl font-bold text-primary">Advyser</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={activeHref === item.href}
            onClick={onItemClick}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div className="space-y-1">
          <button
            onClick={() => {
              onItemClick?.()
              onSettingsClick?.()
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Settings className="size-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => {
              onItemClick?.()
              onLogoutClick?.()
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({
  items,
  activeHref,
  className,
  logoHref,
  onSettingsClick,
  onLogoutClick,
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {/* Desktop Sidebar - Fixed Left */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-sidebar-border bg-sidebar md:block",
          className
        )}
      >
        <SidebarContent
          items={items}
          activeHref={activeHref}
          logoHref={logoHref}
          onSettingsClick={onSettingsClick}
          onLogoutClick={onLogoutClick}
        />
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open sidebar"
              className="bg-background shadow-md"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-60 bg-sidebar p-0"
            showCloseButton={false}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent
              items={items}
              activeHref={activeHref}
              logoHref={logoHref}
              onSettingsClick={onSettingsClick}
              onLogoutClick={onLogoutClick}
              onItemClick={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Spacer for desktop layout - pushes main content */}
      <div className="hidden w-60 shrink-0 md:block" aria-hidden="true" />
    </>
  )
}

export type { SidebarProps, SidebarItem }
