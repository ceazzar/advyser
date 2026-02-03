"use client"

import * as React from "react"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/ui/empty-state"

// API Types
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

interface MessageItem {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string | null
  isFromMe: boolean
  body: string
  status: string
  editedAt: string | null
  createdAt: string
  readBy: { userId: string; readAt: string }[]
}

function formatTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString))
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedConversation, setSelectedConversation] = React.useState<ConversationSummary | null>(null)
  const [newMessage, setNewMessage] = React.useState("")

  // API state
  const [conversations, setConversations] = React.useState<ConversationSummary[]>([])
  const [messages, setMessages] = React.useState<MessageItem[]>([])
  const [conversationsLoading, setConversationsLoading] = React.useState(true)
  const [messagesLoading, setMessagesLoading] = React.useState(false)
  const [conversationsError, setConversationsError] = React.useState<string | null>(null)
  const [messagesError, setMessagesError] = React.useState<string | null>(null)
  const [sendingMessage, setSendingMessage] = React.useState(false)

  // Fetch conversations on mount
  React.useEffect(() => {
    async function fetchConversations() {
      setConversationsLoading(true)
      setConversationsError(null)
      try {
        const response = await fetch("/api/conversations")
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error?.message || "Failed to fetch conversations")
        }

        setConversations(data.data.items)

        // Auto-select first conversation if available
        if (data.data.items.length > 0 && !selectedConversation) {
          setSelectedConversation(data.data.items[0])
        }
      } catch (error) {
        setConversationsError(error instanceof Error ? error.message : "Failed to load conversations")
      } finally {
        setConversationsLoading(false)
      }
    }

    fetchConversations()
  }, [])

  // Fetch messages when conversation is selected
  React.useEffect(() => {
    async function fetchMessages() {
      if (!selectedConversation) {
        setMessages([])
        return
      }

      setMessagesLoading(true)
      setMessagesError(null)
      try {
        const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error?.message || "Failed to fetch messages")
        }

        setMessages(data.data.items)
      } catch (error) {
        setMessagesError(error instanceof Error ? error.message : "Failed to load messages")
      } finally {
        setMessagesLoading(false)
      }
    }

    fetchMessages()
  }, [selectedConversation?.id])

  const filteredConversations = conversations.filter((conv) =>
    conv.otherParty.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return

    setSendingMessage(true)
    try {
      const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: newMessage.trim() }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to send message")
      }

      // Clear the input
      setNewMessage("")

      // Refresh messages to include the new one
      const messagesResponse = await fetch(`/api/conversations/${selectedConversation.id}/messages`)
      const messagesData = await messagesResponse.json()

      if (messagesResponse.ok && messagesData.success) {
        setMessages(messagesData.data.items)
      }

      // Also refresh conversations to update last message preview
      const convsResponse = await fetch("/api/conversations")
      const convsData = await convsResponse.json()

      if (convsResponse.ok && convsData.success) {
        setConversations(convsData.data.items)
        // Update selected conversation with new data
        const updatedConv = convsData.data.items.find(
          (c: ConversationSummary) => c.id === selectedConversation.id
        )
        if (updatedConv) {
          setSelectedConversation(updatedConv)
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      // Could add a toast notification here
    } finally {
      setSendingMessage(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Page Header - Only visible on mobile */}
      <div className="flex flex-col gap-1 pb-4 md:hidden">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-lg border bg-card">
        {/* Conversations Sidebar */}
        <div className="flex w-full flex-col border-r md:w-80 lg:w-96">
          {/* Search */}
          <div className="border-b p-4">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="size-4" />}
            />
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            {conversationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : conversationsError ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
                <p className="text-sm text-destructive">{conversationsError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </Button>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                      selectedConversation?.id === conversation.id && "bg-muted"
                    )}
                  >
                    <div className="relative">
                      <Avatar size="default">
                        {conversation.otherParty.avatarUrl && (
                          <AvatarImage src={conversation.otherParty.avatarUrl} />
                        )}
                        <AvatarFallback size="default">
                          {getInitials(conversation.otherParty.displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">
                          {conversation.otherParty.displayName}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage?.body || "No messages yet"}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge className="size-5 items-center justify-center rounded-full p-0 text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Message Thread */}
        {selectedConversation ? (
          <div className="hidden flex-1 flex-col md:flex">
            {/* Thread Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <Avatar size="default">
                  {selectedConversation.otherParty.avatarUrl && (
                    <AvatarImage src={selectedConversation.otherParty.avatarUrl} />
                  )}
                  <AvatarFallback size="default">
                    {getInitials(selectedConversation.otherParty.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{selectedConversation.otherParty.displayName}</span>
                  {selectedConversation.subject && (
                    <span className="text-xs text-muted-foreground">
                      {selectedConversation.subject}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="size-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="size-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View client profile</DropdownMenuItem>
                    <DropdownMenuItem>Schedule meeting</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Archive conversation</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              {messagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : messagesError ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <p className="text-sm text-destructive">{messagesError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Re-trigger message fetch by updating dependency
                      const conv = selectedConversation
                      setSelectedConversation(null)
                      setTimeout(() => setSelectedConversation(conv), 0)
                    }}
                  >
                    Try again
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.isFromMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2.5",
                          message.isFromMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                        <p
                          className={cn(
                            "mt-1 text-xs",
                            message.isFromMe
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Paperclip className="size-4" />
                </Button>
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[44px] max-h-32 resize-none"
                  disabled={sendingMessage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                >
                  {sendingMessage ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 items-center justify-center md:flex">
            <EmptyState
              title="Select a conversation"
              description="Choose a conversation from the list to view messages"
            />
          </div>
        )}
      </div>
    </div>
  )
}
