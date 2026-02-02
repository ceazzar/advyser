"use client"

/**
 * @deprecated Use DashboardHeaderSlim instead.
 * This component will be removed in a future version.
 * Migration: Replace <AdvisorHeader /> with <DashboardHeaderSlim portalType="advisor" />
 */

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Deprecation warning
if (typeof window !== "undefined") {
  console.warn(
    "[Deprecated] AdvisorHeader is deprecated. Use DashboardHeaderSlim instead.\n" +
    "Migration: Replace <AdvisorHeader /> with <DashboardHeaderSlim portalType=\"advisor\" />"
  )
}
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  UserCheck,
  Bell,
  Settings,
  Menu,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/advisor", icon: LayoutDashboard },
  { label: "Leads", href: "/advisor/leads", icon: Users },
  { label: "Messages", href: "/advisor/messages", icon: MessageSquare },
  { label: "Bookings", href: "/advisor/bookings", icon: Calendar },
  { label: "Clients", href: "/advisor/clients", icon: UserCheck },
]

interface AdvisorHeaderProps {
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

export function AdvisorHeader({
  userName = "Advisor",
  userEmail,
  userImage,
  notificationCount = 0,
  onNotificationClick,
  onSettingsClick,
  onLogout,
  className,
}: AdvisorHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const isActive = (href: string) => {
    if (href === "/advisor") {
      return pathname === href || pathname === "/advisor"
    }
    return pathname?.startsWith(href)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Logo and Badge */}
        <Link href="/advisor" className="flex items-center gap-3 mr-8">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:inline">
              Advyser
            </span>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs hidden sm:flex">
            Advisor Portal
          </Badge>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+0.5rem)] w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onNotificationClick}
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            aria-label="Settings"
            className="hidden sm:flex"
          >
            <Settings className="size-5" />
          </Button>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="size-8 rounded-md bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">A</span>
                  </div>
                  <span>Advyser</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs ml-1">
                    Advisor Portal
                  </Badge>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="size-5" />
                      <span>{item.label}</span>
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  )
                })}
              </nav>
              <div className="mt-auto pt-6 border-t border-border">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onSettingsClick?.()
                  }}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md w-full transition-colors"
                >
                  <Settings className="size-5" />
                  <span>Settings</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export { navItems }
export type { AdvisorHeaderProps, NavItem }
