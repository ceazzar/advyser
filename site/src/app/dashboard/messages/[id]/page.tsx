"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Calendar,
  Star,
  MapPin,
  Clock,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types
interface Message {
  id: string
  senderId: "user" | "advisor"
  content: string
  timestamp: Date
  read: boolean
}

interface ConversationDetail {
  id: string
  advisorId: string
  advisorName: string
  advisorAvatar?: string
  advisorCredentials: string
  advisorSpecialty: string
  advisorLocation: string
  advisorRating: number
  advisorReviewCount: number
  messages: Message[]
}

// Mock conversation data
const mockConversationsData: Record<string, ConversationDetail> = {
  "1": {
    id: "1",
    advisorId: "advisor-1",
    advisorName: "Sarah Chen",
    advisorAvatar: "/avatars/advisor-1.jpg",
    advisorCredentials: "CFP, CFA",
    advisorSpecialty: "Retirement Planning",
    advisorLocation: "Sydney, NSW",
    advisorRating: 4.9,
    advisorReviewCount: 127,
    messages: [
      {
        id: "m1",
        senderId: "user",
        content: "Hi Sarah, I'm looking to maximize my superannuation contributions and plan for early retirement. I'm currently 35 and would like to retire by 55. Can you help me create a strategy?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
      },
      {
        id: "m2",
        senderId: "advisor",
        content: "Hello John! Thank you for reaching out. Planning for early retirement at 55 is an excellent goal, and with a 20-year timeline, we have great opportunities to build a solid strategy.\n\nBefore we dive in, I'd like to understand a few things:\n1. What's your current superannuation balance and annual contribution?\n2. Do you have any other retirement accounts (SMSF)?\n3. What's your target retirement income?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
      {
        id: "m3",
        senderId: "user",
        content: "Thanks for the quick response! Here are the details:\n1. Current superannuation balance is about $150,000, contributing $27,500/year\n2. I have an SMSF with $45,000\n3. I'm hoping for about $80,000/year in retirement",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        read: true,
      },
      {
        id: "m4",
        senderId: "advisor",
        content: "Thanks for sharing those details! You're already in a strong position. Here are my initial thoughts:\n\nFirst, you're maxing out your superannuation which is excellent. If your employer offers contributions above the SG minimum, make sure you're capturing all of it.\n\nFor early retirement, I'd recommend we also look at:\n- Transition to retirement strategies\n- A taxable brokerage account for the gap years (55-60)\n- Additional voluntary super contributions\n\nWould you like to schedule a video call to go through a detailed projection? I can show you different scenarios and how various strategies could impact your timeline.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        read: false,
      },
    ],
  },
  "2": {
    id: "2",
    advisorId: "advisor-2",
    advisorName: "Michael Rodriguez",
    advisorAvatar: "/avatars/advisor-2.jpg",
    advisorCredentials: "CFP, ChFC",
    advisorSpecialty: "Wealth Management",
    advisorLocation: "Melbourne, VIC",
    advisorRating: 4.8,
    advisorReviewCount: 89,
    messages: [
      {
        id: "m1",
        senderId: "user",
        content: "Hello Michael, I recently received an inheritance and want to make sure it's invested wisely. What approach would you recommend?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
      },
      {
        id: "m2",
        senderId: "advisor",
        content: "Thank you for reaching out about managing your inheritance. This is an important financial event, and I'm glad you're taking a thoughtful approach.\n\nBefore making any investment decisions, I'd recommend we discuss:\n- Your overall financial goals\n- Your risk tolerance\n- Your time horizon\n- Any immediate financial needs\n\nWould you be comfortable sharing the approximate amount? This will help me tailor my recommendations appropriately.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
        read: true,
      },
      {
        id: "m3",
        senderId: "user",
        content: "It's approximately $500,000. I don't have any immediate needs - my goal is long-term growth while being reasonably conservative.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        read: true,
      },
      {
        id: "m4",
        senderId: "advisor",
        content: "Great question about asset allocation. Based on your risk tolerance and time horizon, I'd recommend a diversified approach that balances growth with stability. A portfolio of 60% stocks and 40% bonds could be appropriate, though we can adjust based on your specific situation. Let's schedule a call to discuss the details.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: false,
      },
    ],
  },
  "3": {
    id: "3",
    advisorId: "advisor-3",
    advisorName: "Emily Thompson",
    advisorAvatar: "/avatars/advisor-3.jpg",
    advisorCredentials: "CFP",
    advisorSpecialty: "Investment Management",
    advisorLocation: "Brisbane, QLD",
    advisorRating: 4.7,
    advisorReviewCount: 64,
    messages: [
      {
        id: "m1",
        senderId: "user",
        content: "Hi Emily, I'm interested in getting help with my investment portfolio. I feel like I've been too conservative and might be missing growth opportunities.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        read: true,
      },
      {
        id: "m2",
        senderId: "advisor",
        content: "I've reviewed your financial goals and have some recommendations. Let me know when you're available for a call to discuss the details.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
    ],
  },
  "4": {
    id: "4",
    advisorId: "advisor-4",
    advisorName: "David Kim",
    advisorAvatar: "/avatars/advisor-4.jpg",
    advisorCredentials: "CPA, CFP",
    advisorSpecialty: "Tax Planning",
    advisorLocation: "Perth, WA",
    advisorRating: 4.9,
    advisorReviewCount: 156,
    messages: [
      {
        id: "m1",
        senderId: "user",
        content: "David, I need help understanding my quarterly estimated tax payments. As a freelancer, I'm not sure if I'm paying the right amount.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
        read: true,
      },
      {
        id: "m2",
        senderId: "advisor",
        content: "The estimated tax documents I mentioned are attached. Let me know if you have any questions about the quarterly filing schedule.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
      },
    ],
  },
  "5": {
    id: "5",
    advisorId: "advisor-5",
    advisorName: "Jennifer Martinez",
    advisorAvatar: "/avatars/advisor-5.jpg",
    advisorCredentials: "CFP, CDFA",
    advisorSpecialty: "Estate Planning",
    advisorLocation: "Adelaide, SA",
    advisorRating: 4.6,
    advisorReviewCount: 52,
    messages: [
      {
        id: "m1",
        senderId: "user",
        content: "Jennifer, my wife and I are looking to set up a trust for our children. We want to make sure our assets are protected and distributed according to our wishes.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
        read: true,
      },
      {
        id: "m2",
        senderId: "advisor",
        content: "Thank you for sharing those documents. I'll review them and get back to you with my analysis of your current estate plan by end of week.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        read: true,
      },
    ],
  },
}

function formatMessageTime(date: Date): string {
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }
}

function MessageBubble({
  message,
  advisorName,
  advisorAvatar,
}: {
  message: Message
  advisorName: string
  advisorAvatar?: string
}) {
  const isUser = message.senderId === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <Avatar size="sm" className="shrink-0">
          {advisorAvatar && (
            <AvatarImage src={advisorAvatar} alt={advisorName} />
          )}
          <AvatarFallback size="sm">{getInitials(advisorName)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`flex max-w-[75%] flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-muted text-foreground"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params.id as string
  const [newMessage, setNewMessage] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const conversation = mockConversationsData[conversationId]

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // In a real app, this would send the message to an API
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!conversation) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/messages"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Messages
        </Link>
        <Card className="py-12">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold">Conversation not found</h2>
            <p className="mt-2 text-muted-foreground">
              The conversation you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/messages">View All Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/messages"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Avatar size="default">
              {conversation.advisorAvatar && (
                <AvatarImage
                  src={conversation.advisorAvatar}
                  alt={conversation.advisorName}
                />
              )}
              <AvatarFallback size="default">
                {getInitials(conversation.advisorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {conversation.advisorName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {conversation.advisorCredentials} - {conversation.advisorSpecialty}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Schedule call">
            <Calendar className="size-4" />
          </Button>
          <Button variant="outline" size="icon" title="Video call">
            <Video className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/advisors/${conversation.advisorId}`}>
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Schedule Consultation</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Block Advisor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid flex-1 gap-4 lg:grid-cols-4">
        {/* Messages Area */}
        <Card className="flex flex-col lg:col-span-3">
          {/* Messages List */}
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {conversation.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  advisorName={conversation.advisorName}
                  advisorAvatar={conversation.advisorAvatar}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-6">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" title="Attach file">
                <Paperclip className="size-4" />
              </Button>
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[44px] resize-none"
                  rows={1}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="size-4" />
                Send
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>

        {/* Advisor Info Sidebar - Hidden on mobile */}
        <Card className="hidden lg:block">
          <CardHeader className="border-b">
            <CardTitle className="text-base font-medium">Advisor Info</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <Avatar size="lg">
                  {conversation.advisorAvatar && (
                    <AvatarImage
                      src={conversation.advisorAvatar}
                      alt={conversation.advisorName}
                    />
                  )}
                  <AvatarFallback size="lg">
                    {getInitials(conversation.advisorName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{conversation.advisorName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {conversation.advisorCredentials}
                  </p>
                </div>
                <Badge status="verified" size="sm">
                  Verified
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>{conversation.advisorLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span>
                    {conversation.advisorRating} ({conversation.advisorReviewCount}{" "}
                    reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>Usually responds in 24h</span>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href={`/advisors/${conversation.advisorId}`}>
                    View Full Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Calendar className="size-4" />
                  Schedule Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
