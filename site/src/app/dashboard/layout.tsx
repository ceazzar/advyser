"use client"

import { ConsumerLayout } from "@/components/layouts/consumer-layout"
import { useRequireAuth } from "@/lib/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAuthorized } = useRequireAuth(["consumer", "admin"])

  // Show nothing while checking auth (prevents flash)
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <ConsumerLayout>{children}</ConsumerLayout>
}
