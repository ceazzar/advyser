/**
 * Message Types
 * Messaging and conversation types for Advyser platform
 */

/**
 * Message delivery/read status
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

/**
 * File attachment type
 */
export interface FileAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
  thumbnailUrl?: string
  uploadedAt: Date
}

/**
 * Message entity
 */
export interface Message {
  id: string
  conversationId: string
  senderUserId: string
  /** Message body text */
  body: string
  /** File attachments */
  attachments: FileAttachment[]
  /** Delivery status */
  status: MessageStatus
  createdAt: Date
  /** If message was edited */
  editedAt?: Date
}

/**
 * Conversation between consumer and advisor
 */
export interface Conversation {
  id: string
  /** Associated lead ID */
  leadId?: string
  /** Consumer user ID */
  consumerUserId: string
  /** Business/advisor ID */
  businessId: string
  /** Conversation subject/title */
  subject?: string
  /** Last message preview */
  lastMessage?: Message
  /** Unread count for current user */
  unreadCount: number
  /** Is conversation archived */
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Typing indicator state
 */
export interface TypingState {
  conversationId: string
  userId: string
  isTyping: boolean
  lastTypingAt: Date
}
