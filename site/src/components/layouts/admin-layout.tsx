"use client"

import { AdminHeader } from "@/components/layout/admin-header"
import { Sidebar, type SidebarItem } from "@/components/layout/sidebar"
import {
  LayoutDashboard,
  FileCheck,
  Building2,
  Star,
  FileWarning,
  FolderTree,
  BarChart3,
} from "lucide-react"
import { usePathname } from "next/navigation"

interface AdminLayoutProps {
  children: React.ReactNode
}

const adminNavItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="size-5" /> },
  { label: "Claims", href: "/admin/claims", icon: <FileCheck className="size-5" /> },
  { label: "Listings", href: "/admin/listings", icon: <Building2 className="size-5" /> },
  { label: "Reviews", href: "/admin/reviews", icon: <Star className="size-5" /> },
  { label: "Reports", href: "/admin/reports", icon: <FileWarning className="size-5" /> },
  { label: "Categories", href: "/admin/categories", icon: <FolderTree className="size-5" /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="size-5" /> },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const getActiveHref = () => {
    // Exact match for dashboard
    if (pathname === "/admin") {
      return "/admin"
    }
    // Find matching nav item for nested routes
    const matchedItem = adminNavItems.find(
      (item) => item.href !== "/admin" && pathname.startsWith(item.href)
    )
    return matchedItem?.href || "/admin"
  }

  const handleSettingsClick = () => {
    // Navigate to admin settings or open settings modal
    console.log("Admin settings clicked")
  }

  const handleLogoutClick = () => {
    // Handle admin logout
    console.log("Admin logout clicked")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        items={adminNavItems}
        activeHref={getActiveHref()}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={handleLogoutClick}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-60">
        {/* Admin Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
