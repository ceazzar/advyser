"use client"

/**
 * @deprecated Use DashboardHeaderSlim instead.
 * This component will be removed in a future version.
 * Migration: Replace <AdminHeader /> with <DashboardHeaderSlim portalType="admin" />
 */

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Deprecation warning
if (typeof window !== "undefined") {
  console.warn(
    "[Deprecated] AdminHeader is deprecated. Use DashboardHeaderSlim instead.\n" +
    "Migration: Replace <AdminHeader /> with <DashboardHeaderSlim portalType=\"admin\" />"
  )
}
import {
  LayoutDashboard,
  FileCheck,
  Building2,
  Star,
  FileWarning,
  Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Claims", href: "/admin/claims", icon: FileCheck },
  { label: "Listings", href: "/admin/listings", icon: Building2 },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Reports", href: "/admin/reports", icon: FileWarning },
]

interface AdminHeaderProps {
  user?: {
    name: string
    email?: string
    image?: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo with Admin Badge */}
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Advyser</span>
          <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold text-white">
            Admin
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveRoute(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Side: Avatar and Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar size="sm">
                  {user?.image && <AvatarImage src={user.image} alt={user?.name || "Admin"} />}
                  <AvatarFallback size="sm">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "AD"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = "/login"}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon-sm">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-primary">Advyser</span>
                  <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold text-white">
                    Admin
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActiveRoute(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
