"use client"

import * as React from "react"
import {
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  FileText,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock AI conversation history
const mockConversation = [
  {
    id: "1",
    role: "assistant" as const,
    content:
      "Hello! I'm your AI Copilot for Sarah Mitchell's account. I have access to her financial profile, documents, and interaction history. How can I help you today?\n\nHere are some things I can help with:\n- Summarize client's financial situation\n- Generate talking points for meetings\n- Draft email responses\n- Analyze investment options\n- Identify compliance considerations",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "2",
    role: "user" as const,
    content: "Can you summarize Sarah's current financial situation and key goals?",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: "3",
    role: "assistant" as const,
    content:
      "## Sarah Mitchell - Financial Summary\n\n**Current Position (Age 58)**\n- Superannuation: $520,000 across 3 funds (consolidation recommended)\n- Investable Assets: $650,000 total\n- Annual Income: $145,000 (full-time employed)\n- Property: Owns home outright (no mortgage)\n- Risk Profile: Balanced\n\n**Key Goals**\n1. **Retire at 65** - 7 years away, currently 72% on track\n2. **Maintain lifestyle** - Target income of $80,000 p.a. in retirement\n3. **Build emergency fund** - $30,000 target (85% complete)\n\n**Recommendations to Discuss**\n- Super consolidation to reduce fees\n- TTR pension strategy for tax optimization\n- Insurance review (currently no income protection)\n\n**Compliance Notes**\n- Risk profile last updated 8 months ago - consider refreshing\n- Annual review due in February 2026",
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
  },
]

// Suggested prompts
const suggestedPrompts = [
  {
    icon: <FileText className="size-4" />,
    title: "Draft SOA summary",
    prompt: "Draft a plain-language summary of the latest SOA for Sarah to review",
  },
  {
    icon: <TrendingUp className="size-4" />,
    title: "Investment analysis",
    prompt: "Analyze Sarah's current asset allocation and suggest optimizations",
  },
  {
    icon: <AlertTriangle className="size-4" />,
    title: "Compliance check",
    prompt: "Review Sarah's file for any compliance or documentation gaps",
  },
  {
    icon: <Lightbulb className="size-4" />,
    title: "Meeting prep",
    prompt: "Generate talking points for Sarah's upcoming quarterly review",
  },
]

// Insights panel
const mockInsights = [
  {
    type: "opportunity",
    title: "TTR Strategy Opportunity",
    description:
      "Based on Sarah's income and super balance, a TTR strategy could save approximately $8,000 in tax annually.",
  },
  {
    type: "action",
    title: "Super Consolidation",
    description:
      "Consolidating 3 super funds could reduce fees by $1,200 per year and simplify management.",
  },
  {
    type: "risk",
    title: "Insurance Gap",
    description:
      "No income protection in place. At her income level, this represents significant risk.",
  },
]

const insightIcons: Record<string, React.ReactNode> = {
  opportunity: <TrendingUp className="size-4 text-green-600" />,
  action: <Lightbulb className="size-4 text-blue-600" />,
  risk: <AlertTriangle className="size-4 text-yellow-600" />,
}

const insightColors: Record<string, string> = {
  opportunity: "border-green-200 bg-green-50",
  action: "border-blue-200 bg-blue-50",
  risk: "border-yellow-200 bg-yellow-50",
}

export default function ClientCopilotPage() {
  const [messages, setMessages] = React.useState(mockConversation)
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant" as const,
      content:
        "I'm processing your request. In a production environment, this would connect to an AI service that has access to Sarah's complete financial profile, documents, and interaction history to provide personalized, accurate responses.\n\nThis feature helps advisers:\n- Save time on research and analysis\n- Ensure consistency in advice\n- Identify opportunities and risks\n- Draft communications efficiently",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      {/* Main Chat Area */}
      <div className="lg:col-span-2 flex flex-col h-[calc(100vh-20rem)]">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Copilot</CardTitle>
                <CardDescription>
                  Powered by client data and financial expertise
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10"
                    )}
                  >
                    {message.role === "user" ? (
                      <span className="text-xs font-medium">JA</span>
                    ) : (
                      <Sparkles className="size-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] space-y-2",
                      message.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "text-sm prose prose-sm max-w-none",
                          message.role === "user" && "prose-invert"
                        )}
                      >
                        {message.content.split("\n").map((line, i) => (
                          <p key={i} className={line.startsWith("##") ? "font-semibold text-base mt-2" : ""}>
                            {line.replace(/^##\s*/, "").replace(/^\*\*(.+)\*\*$/, "$1")}
                          </p>
                        ))}
                      </div>
                    </div>
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon-xs">
                          <ThumbsUp className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon-xs">
                          <ThumbsDown className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon-xs">
                          <RefreshCw className="size-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="size-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-primary/60 animate-bounce" />
                      <div className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                      <div className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggested Prompts */}
          <div className="border-t px-4 py-3 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-2"
                  onClick={() => handlePromptClick(prompt.prompt)}
                >
                  {prompt.icon}
                  {prompt.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t p-4 shrink-0">
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Ask about Sarah's financial situation, generate documents, or get advice recommendations..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[60px] max-h-32 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                size="icon"
                className="shrink-0 size-[60px]"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send className="size-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              AI responses are suggestions only. Always verify information and apply professional judgment.
            </p>
          </div>
        </Card>
      </div>

      {/* Insights Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="size-5" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Automatically identified opportunities and risks
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {mockInsights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg border p-3",
                  insightColors[insight.type]
                )}
              >
                <div className="flex items-start gap-2">
                  {insightIcons[insight.type]}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {insight.description}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Data Sources</CardTitle>
            <CardDescription>
              Information the AI has access to
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Client Profile</span>
                <Badge className="bg-green-100 text-green-800" size="sm">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Documents (8)</span>
                <Badge className="bg-green-100 text-green-800" size="sm">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Meeting Notes (4)</span>
                <Badge className="bg-green-100 text-green-800" size="sm">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Message History</span>
                <Badge className="bg-green-100 text-green-800" size="sm">
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
