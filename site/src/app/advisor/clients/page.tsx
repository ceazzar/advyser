"use client"

import * as React from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  MessageSquare,
  Calendar,
  Mail,
  Phone,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

// Mock clients data
const mockClients = [
  {
    id: "1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "+61 412 345 678",
    avatar: undefined,
    status: "active" as const,
    category: "Retirement Planning",
    clientSince: "Jan 2024",
    lastContact: "2 days ago",
    nextMeeting: "Feb 15, 2026",
    totalValue: "$650,000",
  },
  {
    id: "2",
    name: "James Chen",
    email: "james.chen@email.com",
    phone: "+61 423 456 789",
    avatar: undefined,
    status: "active" as const,
    category: "Investment Strategy",
    clientSince: "Mar 2024",
    lastContact: "1 week ago",
    nextMeeting: "Feb 20, 2026",
    totalValue: "$1,200,000",
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    phone: "+61 434 567 890",
    avatar: undefined,
    status: "active" as const,
    category: "Superannuation",
    clientSince: "Jun 2024",
    lastContact: "3 days ago",
    nextMeeting: "Mar 1, 2026",
    totalValue: "$400,000",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+61 445 678 901",
    avatar: undefined,
    status: "active" as const,
    category: "Estate Planning",
    clientSince: "Aug 2024",
    lastContact: "Yesterday",
    nextMeeting: "Feb 10, 2026",
    totalValue: "$2,500,000",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+61 456 789 012",
    avatar: undefined,
    status: "active" as const,
    category: "Insurance Review",
    clientSince: "Sep 2024",
    lastContact: "5 days ago",
    nextMeeting: undefined,
    totalValue: "$350,000",
  },
  {
    id: "6",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+61 467 890 123",
    avatar: undefined,
    status: "inactive" as const,
    category: "Retirement Planning",
    clientSince: "Nov 2023",
    lastContact: "2 months ago",
    nextMeeting: undefined,
    totalValue: "$890,000",
  },
]

const categoryFilters = [
  "All Categories",
  "Retirement Planning",
  "Investment Strategy",
  "Superannuation",
  "Estate Planning",
  "Insurance Review",
]

const statusFilters = ["All Status", "Active", "Inactive"]

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("All Categories")
  const [statusFilter, setStatusFilter] = React.useState("All Status")

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "All Categories" || client.category === categoryFilter
    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Active" && client.status === "active") ||
      (statusFilter === "Inactive" && client.status === "inactive")
    return matchesSearch && matchesCategory && matchesStatus
  })

  const activeClients = mockClients.filter((c) => c.status === "active").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            {activeClients} active clients in your practice
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="size-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryFilters.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
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
      </div>

      {/* Clients Table */}
      {filteredClients.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Portfolio Value</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Next Meeting</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link
                        href={`/advisor/clients/${client.id}`}
                        className="flex items-center gap-3 hover:opacity-80"
                      >
                        <Avatar size="sm">
                          {client.avatar && <AvatarImage src={client.avatar} />}
                          <AvatarFallback size="sm">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {client.email}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-muted text-muted-foreground">
                        {client.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {client.totalValue}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.lastContact}
                    </TableCell>
                    <TableCell>
                      {client.nextMeeting ? (
                        <span className="text-muted-foreground">
                          {client.nextMeeting}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">
                          Not scheduled
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        status={client.status}
                      >
                        {client.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/advisor/clients/${client.id}`}>
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/advisor/clients/${client.id}/messages`}>
                              <MessageSquare className="size-4 mr-2" />
                              Send Message
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="size-4 mr-2" />
                            Schedule Meeting
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="size-4 mr-2" />
                            {client.email}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="size-4 mr-2" />
                            {client.phone}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={<Search />}
          title="No clients found"
          description={
            searchQuery || categoryFilter !== "All Categories" || statusFilter !== "All Status"
              ? "Try adjusting your search or filters"
              : "Add your first client to get started"
          }
        />
      )}
    </div>
  )
}
