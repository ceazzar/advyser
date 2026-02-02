"use client"

import * as React from "react"
import { Send, Paperclip, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"

// Mock messages for this client
const mockMessages = [
  {
    id: "1",
    senderId: "client",
    senderName: "Sarah Mitchell",
    content: "Hi, I had a question about our last discussion regarding the TTR pension strategy.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    senderId: "advisor",
    senderName: "John Anderson",
    content: "Hi Sarah! Of course, what would you like to know? I'm happy to clarify any details.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
  },
  {
    id: "3",
    senderId: "client",
    senderName: "Sarah Mitchell",
    content: "I was wondering about the tax implications. If I start a TTR pension now, how will it affect my tax position this financial year?",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    senderId: "advisor",
    senderName: "John Anderson",
    content: "Great question! With a TTR pension, the pension payments you receive will be taxable income, but you'll receive a 15% tax offset since you're over 55. Additionally, the earnings in your super fund supporting the TTR pension will be taxed at a maximum of 15% (compared to potentially higher rates on investments outside super).\n\nThe key benefit is the ability to salary sacrifice more into super while drawing a TTR pension to maintain your income level. This can result in significant tax savings depending on your marginal tax rate.",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
  },
  {
    id: "5",
    senderId: "client",
    senderName: "Sarah Mitchell",
    content: "That makes sense. Would you be able to run some numbers for me to see what the actual savings might look like?",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    senderId: "advisor",
    senderName: "John Anderson",
    content: "Absolutely! I'll prepare a detailed projection showing your current situation vs implementing a TTR strategy. I'll have it ready for our next meeting. In the meantime, I'll email you the preliminary calculations.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
  },
  {
    id: "7",
    senderId: "client",
    senderName: "Sarah Mitchell",
    content: "Perfect, thank you! Looking forward to reviewing it.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "8",
    senderId: "advisor",
    senderName: "John Anderson",
    content: "I've just sent through the projections via email. Let me know if you have any questions before our meeting next week.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "9",
    senderId: "client",
    senderName: "Sarah Mitchell",
    content: "Got it, thanks! I'll review it over the weekend and come prepared with questions.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
]

function formatMessageDate(date: Date): string {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Today at ${new Intl.DateTimeFormat("en-AU", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date)}`
  } else if (diffDays === 1) {
    return `Yesterday at ${new Intl.DateTimeFormat("en-AU", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date)}`
  } else if (diffDays < 7) {
    return new Intl.DateTimeFormat("en-AU", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  } else {
    return new Intl.DateTimeFormat("en-AU", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }
}

export default function ClientMessagesPage() {
  const [newMessage, setNewMessage] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const filteredMessages = searchQuery
    ? mockMessages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockMessages

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)]">
      {/* Search */}
      <div className="pb-4">
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="size-4" />}
          className="max-w-md"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 rounded-lg border bg-card overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.map((message, index) => {
              const isAdvisor = message.senderId === "advisor"
              const showDateSeparator =
                index === 0 ||
                new Date(mockMessages[index - 1].timestamp).toDateString() !==
                  new Date(message.timestamp).toDateString()

              return (
                <React.Fragment key={message.id}>
                  {showDateSeparator && (
                    <div className="flex items-center gap-4 py-2">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-AU", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        }).format(message.timestamp)}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex gap-3",
                      isAdvisor ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar size="sm">
                      <AvatarFallback size="sm">
                        {getInitials(message.senderName)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[70%] space-y-1",
                        isAdvisor ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5",
                          isAdvisor
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p
                        className={cn(
                          "text-xs text-muted-foreground px-2",
                          isAdvisor ? "text-right" : "text-left"
                        )}
                      >
                        {formatMessageDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
            <div ref={messagesEndRef} />
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
    </div>
  )
}
