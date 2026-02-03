"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, MessageSquare, Inbox, Loader2, AlertCircle } from "lucide-react"

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

// API response types
interface ConversationSummary {
  id: string
  subject: string | null
  otherParty: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
  lastMessage: {
    body: string
    createdAt: string
    isFromMe: boolean
  } | null
  unreadCount: number
  lastMessageAt: string | null
  isArchived: boolean
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: {
    items: ConversationSummary[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
  error?: string
}

// Map API data to Conversation interface
function mapApiToConversation(item: ConversationSummary): Conversation {
  return {
    id: item.id,
    advisorName: item.otherParty.displayName,
    advisorAvatar: item.otherParty.avatarUrl || undefined,
    lastMessage: item.lastMessage?.body || "No messages yet",
    timestamp: item.lastMessage
      ? new Date(item.lastMessage.createdAt)
      : item.lastMessageAt
        ? new Date(item.lastMessageAt)
        : new Date(item.createdAt),
    unread: item.unreadCount > 0,
    unreadCount: item.unreadCount,
  }
}

export default function MessagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch conversations on mount
  React.useEffect(() => {
    async function fetchConversations() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/conversations")
        const data: ApiResponse = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch conversations")
        }

        const mapped = data.data.items.map(mapApiToConversation)
        setConversations(mapped)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const totalUnread = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)

  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const query = searchQuery.toLowerCase()
    return conversations.filter(
      (conv) =>
        conv.advisorName.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query)
    )
  }, [searchQuery, conversations])

  const handleConversationClick = (id: string) => {
    router.push(`/dashboard/messages/${id}`)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    // Re-trigger the effect by forcing a state update
    setConversations([])
    // The useEffect will run again since we're changing state
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch conversations")
        }
        setConversations(data.data.items.map(mapApiToConversation))
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "An error occurred")
      })
      .finally(() => {
        setIsLoading(false)
      })
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
          disabled={isLoading}
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
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-6">
              <EmptyState
                icon={<AlertCircle className="text-destructive" />}
                title="Failed to load messages"
                description={error}
                action={{
                  label: "Try again",
                  onClick: handleRetry,
                }}
              />
            </div>
          ) : filteredConversations.length > 0 ? (
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
