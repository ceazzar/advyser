"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  UserCheck,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AdvisorHeader } from "@/components/layout/advisor-header"
import { Sidebar, type SidebarItem } from "@/components/layout/sidebar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { useAuth } from "@/lib/auth-context"

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

const mobileNavItems = sidebarItems.map((item) => ({
  label: item.label,
  href: item.href,
  icon: item.icon,
}))

interface AdvisorLayoutProps {
  children: React.ReactNode
}

export function AdvisorLayout({ children }: AdvisorLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const { user, logout } = useAuth()

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

  const activeHref = getActiveHref()

  return (
    <div className="min-h-screen bg-background">
      {/* Header - full width at top */}
      <AdvisorHeader
        className="md:hidden"
        userName={user?.displayName}
        userEmail={user?.email}
        onSettingsClick={handleSettingsClick}
        onLogout={logout}
      />

      {/* Main layout container */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-all duration-300 md:block",
            sidebarCollapsed ? "w-16" : "w-60"
          )}
        >
          <Sidebar
            items={sidebarItems}
            activeHref={activeHref}
            logoHref="/advisor"
            onSettingsClick={handleSettingsClick}
            onLogoutClick={logout}
            className={cn(
              "static w-full border-r-0",
              sidebarCollapsed && "hidden"
            )}
          />

          {/* Collapsed sidebar content */}
          {sidebarCollapsed && (
            <div className="flex h-full flex-col">
              {/* Collapsed Logo */}
              <div className="flex h-16 shrink-0 items-center justify-center border-b border-sidebar-border">
                <span className="text-xl font-bold text-primary">A</span>
              </div>

              {/* Collapsed Navigation */}
              <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
                {sidebarItems.map((item) => {
                  const isActive = activeHref === item.href
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center rounded-md p-2.5 transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      title={item.label}
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center">
                        {item.icon}
                      </span>
                    </a>
                  )
                })}
              </nav>
            </div>
          )}

          {/* Collapse toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "absolute bottom-4 z-50 size-8 rounded-full border border-border bg-background shadow-sm hover:bg-muted",
              sidebarCollapsed ? "left-1/2 -translate-x-1/2" : "right-0 translate-x-1/2"
            )}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </aside>

        {/* Spacer for desktop sidebar */}
        <div
          className={cn(
            "hidden shrink-0 transition-all duration-300 md:block",
            sidebarCollapsed ? "w-16" : "w-60"
          )}
          aria-hidden="true"
        />

        {/* Main content area */}
        <main
          className={cn(
            "flex-1 min-h-screen",
            "pb-20 md:pb-0" // Bottom padding for mobile nav
          )}
        >
          {/* Desktop header inside main content */}
          <AdvisorHeader
            className="hidden md:block sticky top-0 z-30"
            userName={user?.displayName}
            userEmail={user?.email}
            onSettingsClick={handleSettingsClick}
            onLogout={logout}
          />

          {/* Page content */}
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav items={mobileNavItems} activeHref={activeHref} />
    </div>
  )
}

export type { AdvisorLayoutProps }
