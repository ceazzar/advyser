"use client"

import * as React from "react"
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"

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

// Mock conversations data
const mockConversations = [
  {
    id: "1",
    name: "Sarah Mitchell",
    avatar: undefined,
    lastMessage: "Thank you for the detailed explanation about the pension options.",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    name: "James Chen",
    avatar: undefined,
    lastMessage: "I've reviewed the documents you sent. Can we schedule a call?",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    online: true,
  },
  {
    id: "3",
    name: "Emma Thompson",
    avatar: undefined,
    lastMessage: "Perfect, I'll send over the super statements tomorrow.",
    lastMessageTime: "3 hours ago",
    unreadCount: 0,
    online: false,
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: undefined,
    lastMessage: "Looking forward to our meeting next week.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    online: false,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    avatar: undefined,
    lastMessage: "The insurance review was very helpful, thanks!",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    online: false,
  },
]

// Mock messages for selected conversation
const mockMessages = [
  {
    id: "1",
    senderId: "client",
    content: "Hi, I wanted to follow up on our retirement planning discussion from last week.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    senderId: "advisor",
    content: "Hello Sarah! Of course, I've been reviewing your situation. I have some recommendations I'd like to share with you.",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    senderId: "advisor",
    content: "Based on your current super balance and desired retirement age, I've identified a few strategies that could optimize your tax position while ensuring a comfortable retirement income.",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: "4",
    senderId: "client",
    content: "That sounds great! What are the main options you'd recommend?",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "5",
    senderId: "advisor",
    content: "The main strategies I'd suggest are:\n\n1. Transition to Retirement (TTR) pension - this allows you to access some super while still working\n2. Salary sacrifice arrangements to boost your super in the final years\n3. Spouse contribution splitting to optimize both your retirement positions\n\nWould you like me to prepare a detailed comparison of these options?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "6",
    senderId: "client",
    content: "Thank you for the detailed explanation about the pension options.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
]

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedConversation, setSelectedConversation] = React.useState(mockConversations[0])
  const [newMessage, setNewMessage] = React.useState("")

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In production, send message via API
      setNewMessage("")
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
                      {conversation.avatar && <AvatarImage src={conversation.avatar} />}
                      <AvatarFallback size="default">
                        {getInitials(conversation.name)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-green-500" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{conversation.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
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
          </ScrollArea>
        </div>

        {/* Message Thread */}
        {selectedConversation ? (
          <div className="hidden flex-1 flex-col md:flex">
            {/* Thread Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <Avatar size="default">
                  {selectedConversation.avatar && (
                    <AvatarImage src={selectedConversation.avatar} />
                  )}
                  <AvatarFallback size="default">
                    {getInitials(selectedConversation.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{selectedConversation.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {selectedConversation.online ? "Online" : "Offline"}
                  </span>
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
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.senderId === "advisor" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2.5",
                        message.senderId === "advisor"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={cn(
                          "mt-1 text-xs",
                          message.senderId === "advisor"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
                  disabled={!newMessage.trim()}
                >
                  <Send className="size-4" />
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
