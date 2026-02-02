"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  UserCheck,
  FileCheck,
  Building2,
  Star,
  FileWarning,
  FolderTree,
  BarChart3,
  Settings,
  Search,
  Plus,
  Clock,
  ArrowRight,
} from "lucide-react"

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command"
import { useAuth } from "@/lib/auth-context"

// localStorage keys
const RECENT_PAGES_KEY = "advyser-recent-pages"
const MAX_RECENT_PAGES = 5

interface RecentPage {
  href: string
  title: string
  timestamp: number
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Navigation items by role
const advisorNavItems = [
  { label: "Dashboard", href: "/advisor", icon: LayoutDashboard, shortcut: "⌘1" },
  { label: "Leads", href: "/advisor/leads", icon: Users, shortcut: "⌘2" },
  { label: "Messages", href: "/advisor/messages", icon: MessageSquare, shortcut: "⌘3" },
  { label: "Bookings", href: "/advisor/bookings", icon: Calendar, shortcut: "⌘4" },
  { label: "Clients", href: "/advisor/clients", icon: UserCheck, shortcut: "⌘5" },
  { label: "Settings", href: "/advisor/settings", icon: Settings },
]

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, shortcut: "⌘1" },
  { label: "Claims", href: "/admin/claims", icon: FileCheck, shortcut: "⌘2" },
  { label: "Listings", href: "/admin/listings", icon: Building2, shortcut: "⌘3" },
  { label: "Reviews", href: "/admin/reviews", icon: Star, shortcut: "⌘4" },
  { label: "Reports", href: "/admin/reports", icon: FileWarning, shortcut: "⌘5" },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

const advisorQuickActions = [
  { label: "New Lead", href: "/advisor/leads/new", icon: Plus },
  { label: "Schedule Meeting", href: "/advisor/bookings/new", icon: Calendar },
  { label: "Upload Document", href: "/advisor/documents/upload", icon: FileCheck },
]

const adminQuickActions = [
  { label: "Review Claim", href: "/admin/claims", icon: FileCheck },
  { label: "Moderate Listing", href: "/admin/listings", icon: Building2 },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [recentPages, setRecentPages] = React.useState<RecentPage[]>([])

  // Determine user role and get appropriate nav items
  const isAdvisor = pathname?.startsWith("/advisor")
  const isAdmin = pathname?.startsWith("/admin")

  const navItems = isAdmin ? adminNavItems : isAdvisor ? advisorNavItems : advisorNavItems
  const quickActions = isAdmin ? adminQuickActions : advisorQuickActions

  // Load recent pages from localStorage on mount only
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(RECENT_PAGES_KEY)
        if (stored) {
          setRecentPages(JSON.parse(stored))
        }
      } catch (e) {
        console.error("Failed to load recent pages:", e)
      }
    }
  }, [])

  // Save current page to recent pages on navigation
  React.useEffect(() => {
    if (typeof window !== "undefined" && pathname) {
      const currentItem = [...advisorNavItems, ...adminNavItems].find(
        item => item.href === pathname || pathname.startsWith(item.href + "/")
      )

      if (currentItem) {
        try {
          const stored = localStorage.getItem(RECENT_PAGES_KEY)
          const existing: RecentPage[] = stored ? JSON.parse(stored) : []

          // Remove duplicate if exists
          const filtered = existing.filter(p => p.href !== currentItem.href)

          // Add current page to front
          const updated = [
            { href: currentItem.href, title: currentItem.label, timestamp: Date.now() },
            ...filtered,
          ].slice(0, MAX_RECENT_PAGES)

          localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(updated))
          setRecentPages(updated)
        } catch (e) {
          console.error("Failed to save recent page:", e)
        }
      }
    }
  }, [pathname])

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  const navigateTo = React.useCallback((href: string) => {
    runCommand(() => router.push(href))
  }, [router, runCommand])

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Palette"
      description="Search for pages and actions"
    >
      <CommandInput placeholder="Search or jump to..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Recent Pages */}
        {recentPages.length > 0 && (
          <CommandGroup heading="Recent">
            {recentPages.map((page) => {
              const item = [...advisorNavItems, ...adminNavItems].find(i => i.href === page.href)
              const Icon = item?.icon || Clock
              return (
                <CommandItem
                  key={page.href}
                  value={`recent-${page.title}`}
                  onSelect={() => navigateTo(page.href)}
                >
                  <Icon className="mr-2 size-4" />
                  <span>{page.title}</span>
                  <CommandShortcut>
                    <Clock className="size-3" />
                  </CommandShortcut>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.href}
                value={`nav-${item.label}`}
                onSelect={() => navigateTo(item.href)}
              >
                <Icon className="mr-2 size-4" />
                <span>Go to {item.label}</span>
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <CommandItem
                key={action.href}
                value={`action-${action.label}`}
                onSelect={() => navigateTo(action.href)}
              >
                <Icon className="mr-2 size-4" />
                <span>{action.label}</span>
                <ArrowRight className="ml-auto size-3 text-muted-foreground" />
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Search */}
        <CommandGroup heading="Search">
          <CommandItem
            value="search-advisors"
            onSelect={() => navigateTo("/search")}
          >
            <Search className="mr-2 size-4" />
            <span>Search Advisors</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

// Hook to manage command palette state with keyboard shortcut
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open/toggle
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      // Note: Escape is handled by Dialog component natively
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return { open, setOpen }
}

export type { CommandPaletteProps, RecentPage }
