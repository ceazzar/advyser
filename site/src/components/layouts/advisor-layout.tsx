"use client"

import {
  Calendar,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Search,
  Settings,
  User,
  UserCheck,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { DashboardHeaderSlim } from "@/components/layout/dashboard-header-slim"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

// localStorage key for sidebar state
const SIDEBAR_COLLAPSED_KEY = "advyser-sidebar-collapsed"

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/advisor",
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    label: "Leads",
    href: "/advisor/leads",
    icon: <Users className="size-5" />,
  },
  {
    label: "Messages",
    href: "/advisor/messages",
    icon: <MessageSquare className="size-5" />,
  },
  {
    label: "Bookings",
    href: "/advisor/bookings",
    icon: <Calendar className="size-5" />,
  },
  {
    label: "Clients",
    href: "/advisor/clients",
    icon: <UserCheck className="size-5" />,
  },
]

// Mobile bottom nav: 4 items only (Home, Search, Messages, Profile)
const mobileNavItems = [
  { label: "Home", href: "/advisor", icon: <Home className="size-5" /> },
  { label: "Search", href: "/search", icon: <Search className="size-5" /> },
  { label: "Messages", href: "/advisor/messages", icon: <MessageSquare className="size-5" /> },
  { label: "Profile", href: "/advisor/settings", icon: <User className="size-5" /> },
]

interface AdvisorLayoutProps {
  children: React.ReactNode
}

export function AdvisorLayout({ children }: AdvisorLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // SSR-safe localStorage pattern for sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (saved !== null) {
        setSidebarCollapsed(saved === "true")
      }
    }
  }, [])

  React.useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed))
    }
  }, [sidebarCollapsed, mounted])

  const handleSettingsClick = () => {
    router.push("/advisor/settings")
  }

  // Determine active href for sidebar highlighting
  const getActiveHref = () => {
    for (const item of sidebarItems) {
      if (item.href === "/advisor") {
        if (pathname === item.href || pathname === "/advisor") {
          return item.href
        }
      } else if (pathname?.startsWith(item.href)) {
        return item.href
      }
    }
    return undefined
  }

  // Get page title from current path
  const getPageTitle = () => {
    const item = sidebarItems.find(
      (item) =>
        item.href === pathname ||
        (item.href !== "/advisor" && pathname?.startsWith(item.href))
    )
    return item?.label || "Dashboard"
  }

  const activeHref = getActiveHref()

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Main layout container */}
        <div className="flex">
          {/* Desktop Sidebar - NO hamburger, sidebar only on desktop */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar md:block",
              // CSS cubic-bezier for spring-like animation
              "transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
              sidebarCollapsed ? "w-16" : "w-60"
            )}
          >
            <div className="flex h-full flex-col">
              {/* Logo Header */}
              <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
                <Link href="/advisor" className="flex items-center gap-2">
                  {sidebarCollapsed ? (
                    <span className="text-xl font-bold text-primary">A</span>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-foreground">Advyser</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        for Advisors
                      </span>
                    </>
                  )}
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {sidebarItems.map((item) => {
                  const isActive = activeHref === item.href

                  if (sidebarCollapsed) {
                    return (
                      <Tooltip key={item.href} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-center rounded-md p-2.5 transition-colors",
                              "group",
                              isActive
                                ? "bg-sidebar-accent relative before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-primary text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center transition-transform duration-150 group-hover:scale-105">
                              {item.icon}
                            </span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          <span>{item.label}</span>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        "group",
                        isActive
                          ? "bg-sidebar-accent relative before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-primary text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center transition-transform duration-150 group-hover:scale-105">
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Bottom Section - Settings, Logout, Collapse */}
              <div className="shrink-0 border-t border-sidebar-border p-3 space-y-1">
                {sidebarCollapsed ? (
                  <>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleSettingsClick}
                          className="flex w-full items-center justify-center rounded-md p-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <Settings className="size-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={logout}
                          className="flex w-full items-center justify-center rounded-md p-2.5 text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <LogOut className="size-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Logout</TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSettingsClick}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Settings className="size-5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="size-5" />
                      <span>Logout</span>
                    </button>
                  </>
                )}

                {/* Collapse Toggle - Inline in footer */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors mt-2"
                >
                  <PanelLeftClose
                    className={cn(
                      "size-4 transition-transform duration-300",
                      sidebarCollapsed && "rotate-180"
                    )}
                  />
                  {!sidebarCollapsed && <span>Collapse</span>}
                  {!sidebarCollapsed && (
                    <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded">
                      ⌘B
                    </kbd>
                  )}
                </button>
              </div>
            </div>
          </aside>

          {/* Spacer for desktop sidebar */}
          <div
            className={cn(
              "hidden shrink-0 md:block",
              "transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
              sidebarCollapsed ? "w-16" : "w-60"
            )}
            aria-hidden="true"
          />

          {/* Main content area */}
          <main className={cn("flex-1 min-h-screen", "pb-20 md:pb-0")}>
            {/* Slim header - NO navigation links */}
            <DashboardHeaderSlim
              portalType="advisor"
              pageTitle={getPageTitle()}
              userName={user?.displayName}
              userEmail={user?.email}
              onSettingsClick={handleSettingsClick}
              onLogout={logout}
            />

            {/* Page content */}
            <div className="p-4 md:p-6">{children}</div>
          </main>
        </div>

        {/* Mobile Bottom Navigation - 4 items, NO hamburger anywhere */}
        <MobileBottomNav items={mobileNavItems} activeHref={activeHref} />
      </div>
    </TooltipProvider>
  )
}

export type { AdvisorLayoutProps }
