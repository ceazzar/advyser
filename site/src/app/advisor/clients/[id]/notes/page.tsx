"use client"

import * as React from "react"
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Pin,
  Calendar,
  Clock,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock notes data
const mockNotes = [
  {
    id: "1",
    title: "Quarterly Review - Q4 2025",
    content:
      "Discussed retirement timeline and current asset allocation. Sarah is comfortable with the balanced approach but wants to explore more conservative options as she gets closer to retirement. Action items:\n\n1. Review insurance coverage\n2. Prepare TTR strategy comparison\n3. Schedule follow-up in 3 months",
    category: "Meeting Notes",
    author: "John Anderson",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isPinned: true,
  },
  {
    id: "2",
    title: "Phone Call - Super Consolidation",
    content:
      "Sarah called to discuss consolidating her three super accounts. She has:\n- AustralianSuper: $320,000\n- REST Super: $150,000\n- Old employer fund: $50,000\n\nRecommended consolidating to AustralianSuper based on fees and performance. Will prepare rollover paperwork.",
    category: "Phone Call",
    author: "John Anderson",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    isPinned: false,
  },
  {
    id: "3",
    title: "Insurance Review Notes",
    content:
      "Reviewed current insurance coverage through super:\n- Death cover: $500,000\n- TPD: $500,000\n- Income protection: Not currently held\n\nRecommended adding income protection given her income level. Will provide quotes from multiple providers.",
    category: "Review",
    author: "John Anderson",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    isPinned: false,
  },
  {
    id: "4",
    title: "Initial Consultation",
    content:
      "First meeting with Sarah. Key points discussed:\n- Retirement goal: Age 65, maintain current lifestyle\n- Risk tolerance: Moderate, concerned about market volatility\n- Current investments: Primarily super, owns home outright\n- Goals: Maximize super, understand pension options\n\nSent fact find and risk profile questionnaire.",
    category: "Meeting Notes",
    author: "John Anderson",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    isPinned: true,
  },
]

const noteCategories = [
  "All",
  "Meeting Notes",
  "Phone Call",
  "Review",
  "Follow-up",
  "General",
]

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export default function ClientNotesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = React.useState(false)
  const [newNote, setNewNote] = React.useState({
    title: "",
    content: "",
    category: "Meeting Notes",
  })

  const filteredNotes = mockNotes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "All" || note.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Pinned notes first, then by date
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

  const handleCreateNote = () => {
    setIsNewNoteDialogOpen(false)
    setNewNote({ title: "", content: "", category: "Meeting Notes" })
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="size-4" />}
            className="max-w-sm"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {noteCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isNewNoteDialogOpen} onOpenChange={setIsNewNoteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
              <DialogDescription>
                Create a new note for this client
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newNote.category}
                  onValueChange={(v) =>
                    setNewNote((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {noteCategories.filter((c) => c !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your note..."
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsNewNoteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateNote}
                disabled={!newNote.title.trim() || !newNote.content.trim()}
              >
                Save Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className={cn(
                "relative",
                note.isPinned && "border-primary/50 bg-primary/5"
              )}
            >
              {note.isPinned && (
                <Pin className="absolute top-4 right-12 size-4 text-primary" />
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {note.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-muted text-muted-foreground" size="sm">
                        {note.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(note.createdAt)}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit3 className="size-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pin className="size-4 mr-2" />
                        {note.isPinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="size-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">
                  {note.content}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar size="xs">
                      <AvatarFallback size="xs">
                        {getInitials(note.author)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {note.author}
                    </span>
                  </div>
                  {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      Edited {formatRelativeDate(note.updatedAt)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Edit3 />}
          title="No notes found"
          description={
            searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search or filter"
              : "Add notes to keep track of important client information"
          }
          action={
            !searchQuery && selectedCategory === "All"
              ? {
                  label: "Add Note",
                  onClick: () => setIsNewNoteDialogOpen(true),
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
