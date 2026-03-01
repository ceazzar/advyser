"use client"

import {
  Bell,
  Building2,
  Calendar,
  FileText,
  LogOut,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CommandPalette, useCommandPalette } from "@/components/ui/command-palette"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DashboardHeaderSlimProps {
  /** Portal type for context */
  portalType: "advisor" | "admin"
  /** Page title for mobile display */
  pageTitle?: string
  /** User display name for avatar */
  userName?: string
  /** User email */
  userEmail?: string
  /** User avatar image URL */
  userImage?: string
  /** Number of unread notifications */
  notificationCount?: number
  /** Callback when notification bell is clicked */
  onNotificationClick?: () => void
  /** Callback when settings is clicked */
  onSettingsClick?: () => void
  /** Callback when logout is clicked */
  onLogout?: () => void
  className?: string
}

// Quick create actions by portal type
const advisorQuickActions = [
  { label: "New Lead", href: "/advisor/leads/new", icon: User },
  { label: "Schedule Meeting", href: "/advisor/bookings/new", icon: Calendar },
  { label: "Upload Document", href: "/advisor/documents/upload", icon: FileText },
]

const adminQuickActions = [
  { label: "Intake Queue", href: "/admin/intake", icon: Building2 },
  { label: "Review Claim", href: "/admin/claims", icon: FileText },
  { label: "Moderate Listing", href: "/admin/listings", icon: FileText },
]

export function DashboardHeaderSlim({
  portalType,
  pageTitle,
  userName = "User",
  userEmail,
  userImage,
  notificationCount = 0,
  onNotificationClick,
  onSettingsClick,
  onLogout,
  className,
}: DashboardHeaderSlimProps) {
  const { open: commandOpen, setOpen: setCommandOpen } = useCommandPalette()
  const quickActions = portalType === "admin" ? adminQuickActions : advisorQuickActions

  return (
    <>
      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          className
        )}
      >
        <div className="flex h-16 items-center px-4 md:px-6">
          {/* Mobile: Page Title */}
          <div className="md:hidden flex-1">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {pageTitle || "Dashboard"}
            </h1>
          </div>

          {/* Desktop: Search Trigger */}
          <button
            onClick={() => setCommandOpen(true)}
            className={cn(
              "hidden md:flex items-center gap-2",
              "h-9 w-64 lg:w-80 px-3",
              "rounded-full border border-input bg-muted/50",
              "text-sm text-muted-foreground",
              "hover:bg-muted hover:border-border",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
          >
            <Search className="size-4" />
            <span className="flex-1 text-left">Search or jump to...</span>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium bg-background border border-border rounded">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          {/* Spacer */}
          <div className="flex-1 md:flex-none" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Quick Create - Desktop only */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  aria-label="Quick create"
                >
                  <Plus className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <DropdownMenuItem key={action.href} asChild>
                      <Link href={action.href} className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <span>{action.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onNotificationClick}
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              {/* Dot for 1-9, count for 10+ */}
              {notificationCount > 0 && notificationCount <= 9 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
              )}
              {notificationCount > 9 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center ring-2 ring-background">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </Button>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "relative flex items-center rounded-full",
                    "ring-2 ring-transparent hover:ring-primary/20",
                    "transition-[ring-color] duration-150",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                  aria-label="User menu"
                >
                  <Avatar size="sm">
                    {userImage && <AvatarImage src={userImage} alt={userName} />}
                    <AvatarFallback size="sm">{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userName}</p>
                    {userEmail && (
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSettingsClick}>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} variant="destructive">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}

export type { DashboardHeaderSlimProps }
