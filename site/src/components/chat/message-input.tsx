"use client"

import { Paperclip, Send, Smile } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface MessageInputProps {
  onSend?: (message: string) => void
  onAttachmentClick?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function MessageInput({
  onSend,
  onAttachmentClick,
  placeholder = "Type a message...",
  disabled = false,
  className,
}: MessageInputProps) {
  const [message, setMessage] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const sendMessage = () => {
    if (message.trim() && onSend) {
      onSend(message.trim())
      setMessage("")
      textareaRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-end gap-2 p-4 border-t bg-background",
        className
      )}
    >
      {onAttachmentClick && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onAttachmentClick}
          disabled={disabled}
          className="shrink-0"
        >
          <Paperclip className="size-5" />
          <span className="sr-only">Attach file</span>
        </Button>
      )}

      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-32 resize-none pr-10"
          rows={1}
        />
      </div>

      <Button
        type="submit"
        size="icon"
        disabled={disabled || !message.trim()}
        className="shrink-0"
      >
        <Send className="size-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}
