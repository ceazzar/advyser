"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MessageSquare, Inbox } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCard } from "@/components/composite/message-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"

// Types
interface Conversation {
  id: string
  advisorName: string
  advisorAvatar?: string
  lastMessage: string
  timestamp: Date
  unread: boolean
  unreadCount: number
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: "1",
    advisorName: "Sarah Chen",
    advisorAvatar: "/avatars/advisor-1.jpg",
    lastMessage: "Thanks for reaching out! I'd love to discuss your retirement planning goals. I've reviewed your initial message and have some thoughts on how we can maximize your superannuation contributions while also exploring additional tax-advantaged accounts.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    unread: true,
    unreadCount: 2,
  },
  {
    id: "2",
    advisorName: "Michael Rodriguez",
    advisorAvatar: "/avatars/advisor-2.jpg",
    lastMessage: "Great question about asset allocation. Based on your risk tolerance and time horizon, I'd recommend a diversified approach that balances growth with stability...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    unread: true,
    unreadCount: 1,
  },
  {
    id: "3",
    advisorName: "Emily Thompson",
    advisorAvatar: "/avatars/advisor-3.jpg",
    lastMessage: "I've reviewed your financial goals and have some recommendations. Let me know when you're available for a call to discuss the details.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: false,
    unreadCount: 0,
  },
  {
    id: "4",
    advisorName: "David Kim",
    advisorAvatar: "/avatars/advisor-4.jpg",
    lastMessage: "The estimated tax documents I mentioned are attached. Let me know if you have any questions about the quarterly filing schedule.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unread: false,
    unreadCount: 0,
  },
  {
    id: "5",
    advisorName: "Jennifer Martinez",
    advisorAvatar: "/avatars/advisor-5.jpg",
    lastMessage: "Thank you for sharing those documents. I'll review them and get back to you with my analysis of your current estate plan by end of week.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    unread: false,
    unreadCount: 0,
  },
]

export default function MessagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")

  const totalUnread = mockConversations.reduce((acc, conv) => acc + conv.unreadCount, 0)

  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return mockConversations
    const query = searchQuery.toLowerCase()
    return mockConversations.filter(
      (conv) =>
        conv.advisorName.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleConversationClick = (id: string) => {
    router.push(`/dashboard/messages/${id}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Messages
            </h1>
            {totalUnread > 0 && (
              <Badge status="active" size="sm">
                {totalUnread} unread
              </Badge>
            )}
          </div>
          <p className="mt-1 text-muted-foreground">
            Communicate with your financial advisors
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="size-4" />}
        />
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="size-5" />
            Inbox
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredConversations.length > 0 ? (
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <MessageCard
                  key={conversation.id}
                  id={conversation.id}
                  name={conversation.advisorName}
                  avatar={conversation.advisorAvatar}
                  lastMessage={conversation.lastMessage}
                  timestamp={conversation.timestamp}
                  unread={conversation.unread}
                  onClick={() => handleConversationClick(conversation.id)}
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-6">
              <EmptyState
                icon={<Search />}
                title="No conversations found"
                description={`No messages match "${searchQuery}"`}
                action={{
                  label: "Clear search",
                  onClick: () => setSearchQuery(""),
                }}
              />
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                icon={<MessageSquare />}
                title="No messages yet"
                description="Once advisors respond to your requests, you'll be able to chat with them here"
                action={{
                  label: "Find Advisors",
                  onClick: () => router.push("/search"),
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground">Messaging Tips</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span>Be specific about your financial goals and timeline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span>Share relevant documents securely through the platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span>Ask questions - advisors are here to help you understand your options</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              <span>Schedule a video call for more complex discussions</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
