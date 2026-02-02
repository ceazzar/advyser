"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import {
  ArrowLeft,
  User,
  MessageSquare,
  FileText,
  StickyNote,
  Sparkles,
  CheckSquare,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock client data - in production, fetch by ID
const mockClient = {
  id: "1",
  name: "Sarah Mitchell",
  email: "sarah.mitchell@email.com",
  avatar: undefined,
  status: "active" as const,
  category: "Retirement Planning",
  clientSince: "January 2024",
}

const clientTabs = [
  {
    label: "Overview",
    href: "",
    icon: <User className="size-4" />,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: <MessageSquare className="size-4" />,
  },
  {
    label: "Documents",
    href: "/documents",
    icon: <FileText className="size-4" />,
  },
  {
    label: "Notes",
    href: "/notes",
    icon: <StickyNote className="size-4" />,
  },
  {
    label: "AI Copilot",
    href: "/copilot",
    icon: <Sparkles className="size-4" />,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: <CheckSquare className="size-4" />,
  },
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  const clientId = params.id as string

  const getActiveTab = () => {
    const basePath = `/advisor/clients/${clientId}`
    if (pathname === basePath) return ""

    for (const tab of clientTabs) {
      if (tab.href && pathname === `${basePath}${tab.href}`) {
        return tab.href
      }
    }
    return ""
  }

  const activeTab = getActiveTab()

  return (
    <div className="space-y-6">
      {/* Back Button & Client Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/advisor/clients">
            <ArrowLeft className="size-4" />
            Back to Clients
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {mockClient.avatar && <AvatarImage src={mockClient.avatar} />}
              <AvatarFallback size="lg">
                {getInitials(mockClient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{mockClient.name}</h1>
                <Badge status={mockClient.status}>
                  {mockClient.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{mockClient.category}</p>
              <p className="text-sm text-muted-foreground">
                Client since {mockClient.clientSince}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <MessageSquare className="size-4" />
              Message
            </Button>
            <Button>Schedule Meeting</Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {clientTabs.map((tab) => {
            const href = `/advisor/clients/${clientId}${tab.href}`
            const isActive = activeTab === tab.href

            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                  "border-b-2 -mb-px",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )}
              >
                {tab.icon}
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  )
}
