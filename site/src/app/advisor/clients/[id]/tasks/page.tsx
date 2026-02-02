"use client"

import * as React from "react"
import {
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Flag,
  User,
  Trash2,
  Edit3,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/ui/empty-state"
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

// Mock tasks data
const mockTasks = [
  {
    id: "1",
    title: "Prepare annual review documents",
    description:
      "Compile performance reports, updated projections, and review questionnaire for upcoming annual review meeting.",
    status: "in-progress" as const,
    priority: "high" as const,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    assignee: "John Anderson",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Send super consolidation paperwork",
    description:
      "Prepare and send rollover forms for consolidating REST and old employer super into AustralianSuper.",
    status: "pending" as const,
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignee: "John Anderson",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Obtain income protection quotes",
    description:
      "Request quotes from 3 providers for income protection insurance based on Sarah's income and occupation.",
    status: "pending" as const,
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    assignee: "Sarah Williams",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Update risk profile questionnaire",
    description:
      "Send updated risk profile questionnaire - last completed 8 months ago.",
    status: "pending" as const,
    priority: "low" as const,
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    assignee: "John Anderson",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Review TTR strategy projections",
    description:
      "Complete analysis of TTR pension strategy including tax savings calculations.",
    status: "completed" as const,
    priority: "high" as const,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignee: "John Anderson",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "File meeting notes from quarterly review",
    description: "Document key discussion points and action items from Q4 2025 review.",
    status: "completed" as const,
    priority: "low" as const,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    assignee: "John Anderson",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]

const statusFilters = ["All", "Pending", "In Progress", "Completed"]
const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-gray-100 text-gray-600 border-gray-200",
}

function formatDueDate(date: Date, status: string): string {
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (status === "completed") {
    return new Intl.DateTimeFormat("en-AU", {
      day: "numeric",
      month: "short",
    }).format(date)
  }

  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
  if (diffDays === 0) return "Due today"
  if (diffDays === 1) return "Due tomorrow"
  if (diffDays < 7) return `Due in ${diffDays} days`

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
  }).format(date)
}

export default function ClientTasksPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = React.useState(false)
  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignee: "John Anderson",
  })

  const filteredTasks = mockTasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending" && task.status === "pending") ||
        (statusFilter === "In Progress" && task.status === "in-progress") ||
        (statusFilter === "Completed" && task.status === "completed")
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Completed tasks at the bottom
      if (a.status === "completed" && b.status !== "completed") return 1
      if (a.status !== "completed" && b.status === "completed") return -1
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      // Then by due date
      return a.dueDate.getTime() - b.dueDate.getTime()
    })

  const pendingCount = mockTasks.filter((t) => t.status !== "completed").length
  const completedCount = mockTasks.filter((t) => t.status === "completed").length

  const handleCreateTask = () => {
    setIsNewTaskDialogOpen(false)
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignee: "John Anderson",
    })
  }

  const toggleTaskStatus = (taskId: string) => {
    // In production, update task status via API
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="size-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Open Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
                <Flag className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockTasks.filter((t) => t.priority === "high" && t.status !== "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="size-4" />}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
              <DialogDescription>
                Add a new task for this client
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Task description..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(v) =>
                      setNewTask((prev) => ({ ...prev, priority: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={newTask.assignee}
                  onValueChange={(v) =>
                    setNewTask((prev) => ({ ...prev, assignee: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Anderson">John Anderson</SelectItem>
                    <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                    <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsNewTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim()}
              >
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <Card>
          <CardContent className="p-0 divide-y">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-start gap-4 p-4",
                  task.status === "completed" && "opacity-60"
                )}
              >
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-medium",
                          task.status === "completed" && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {task.description}
                      </p>
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
                          <CheckCircle2 className="size-4 mr-2" />
                          Mark as {task.status === "completed" ? "Incomplete" : "Complete"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <Badge className={cn("border", priorityColors[task.priority])} size="sm">
                      <Flag className="size-3 mr-1" />
                      {task.priority}
                    </Badge>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs",
                        task.status !== "completed" &&
                          task.dueDate < new Date() &&
                          "text-red-600 font-medium"
                      )}
                    >
                      <Calendar className="size-3" />
                      {formatDueDate(task.dueDate, task.status)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="size-3" />
                      {task.assignee}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={<CheckCircle2 />}
          title="No tasks found"
          description={
            searchQuery || statusFilter !== "All"
              ? "Try adjusting your search or filter"
              : "Create tasks to track work for this client"
          }
          action={
            !searchQuery && statusFilter === "All"
              ? {
                  label: "Add Task",
                  onClick: () => setIsNewTaskDialogOpen(true),
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
