"use client"

import { Calendar,FileText, LayoutDashboard, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import * as React from "react"

import { ConsumerHeader } from "@/components/layout/consumer-header"
import { DashboardFooter } from "@/components/layout/dashboard-footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { useAuth } from "@/lib/auth-context"

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
  { label: "Requests", href: "/dashboard/requests", icon: <FileText /> },
  { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare /> },
  { label: "Bookings", href: "/dashboard/bookings", icon: <Calendar /> },
]

interface ConsumerLayoutProps {
  children: React.ReactNode
}

export function ConsumerLayout({ children }: ConsumerLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <ConsumerHeader
        user={user ? { name: user.displayName, email: user.email } : undefined}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-20 sm:px-6 md:pb-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* Footer - hidden on mobile */}
      <DashboardFooter className="hidden md:block" />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav items={mobileNavItems} activeHref={pathname} />
    </div>
  )
}
