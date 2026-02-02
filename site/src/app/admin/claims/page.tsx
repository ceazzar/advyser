"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  Download,
} from "lucide-react"
import Link from "next/link"

// Mock data for claims
const mockClaims = [
  {
    id: "CLM-001",
    advisorName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    businessName: "Johnson Financial Services",
    afsNumber: "AFS123456",
    submittedAt: "2024-01-15T10:30:00",
    status: "pending" as const,
    documents: 3,
    priority: "high",
  },
  {
    id: "CLM-002",
    advisorName: "Robert Chen",
    email: "robert.chen@email.com",
    businessName: "Chen Wealth Management",
    afsNumber: "AFS789012",
    submittedAt: "2024-01-14T15:45:00",
    status: "pending" as const,
    documents: 2,
    priority: "medium",
  },
  {
    id: "CLM-003",
    advisorName: "Amanda Lee",
    email: "amanda.lee@email.com",
    businessName: "Lee & Associates",
    afsNumber: "AFS345678",
    submittedAt: "2024-01-14T09:20:00",
    status: "pending" as const,
    documents: 4,
    priority: "low",
  },
  {
    id: "CLM-004",
    advisorName: "David Miller",
    email: "david.miller@email.com",
    businessName: "Miller Advisory Group",
    afsNumber: "AFS901234",
    submittedAt: "2024-01-13T14:00:00",
    status: "approved" as const,
    documents: 3,
    priority: "medium",
  },
  {
    id: "CLM-005",
    advisorName: "Jennifer Taylor",
    email: "jennifer.taylor@email.com",
    businessName: "Taylor Investments",
    afsNumber: "AFS567890",
    submittedAt: "2024-01-12T11:15:00",
    status: "rejected" as const,
    documents: 1,
    priority: "low",
  },
  {
    id: "CLM-006",
    advisorName: "Michael Brown",
    email: "michael.brown@email.com",
    businessName: "Brown Financial Planning",
    afsNumber: "AFS234567",
    submittedAt: "2024-01-11T16:30:00",
    status: "approved" as const,
    documents: 5,
    priority: "high",
  },
  {
    id: "CLM-007",
    advisorName: "Emily Watson",
    email: "emily.watson@email.com",
    businessName: "Watson Wealth Advisors",
    afsNumber: "AFS890123",
    submittedAt: "2024-01-10T08:45:00",
    status: "pending" as const,
    documents: 2,
    priority: "medium",
  },
  {
    id: "CLM-008",
    advisorName: "James Wilson",
    email: "james.wilson@email.com",
    businessName: "Wilson & Partners",
    afsNumber: "AFS456789",
    submittedAt: "2024-01-09T13:20:00",
    status: "rejected" as const,
    documents: 2,
    priority: "low",
  },
]

function getStatusBadge(status: "pending" | "approved" | "rejected") {
  switch (status) {
    case "pending":
      return <Badge status="pending">Pending</Badge>
    case "approved":
      return <Badge status="verified">Approved</Badge>
    case "rejected":
      return <Badge status="inactive">Rejected</Badge>
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
          High
        </span>
      )
    case "medium":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          Medium
        </span>
      )
    case "low":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          Low
        </span>
      )
    default:
      return null
  }
}

export default function ClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("submittedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter and sort claims
  const filteredClaims = mockClaims
    .filter((claim) => {
      const matchesSearch =
        claim.advisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || claim.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      return 0
    })

  const pendingCount = mockClaims.filter((c) => c.status === "pending").length
  const approvedCount = mockClaims.filter((c) => c.status === "approved").length
  const rejectedCount = mockClaims.filter((c) => c.status === "rejected").length

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claim Requests</h1>
          <p className="text-muted-foreground">
            Review and manage advisor claim requests
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="size-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="size-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
                <p className="text-sm text-yellow-700">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="size-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
                <p className="text-sm text-green-700">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="size-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{rejectedCount}</p>
                <p className="text-sm text-red-700">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="size-4" />}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="size-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredClaims.length} of {mockClaims.length} claims
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Claim ID</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("advisorName")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Advisor
                    <ArrowUpDown className="size-4" />
                  </button>
                </TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>AFS Number</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("submittedAt")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Submitted
                    <ArrowUpDown className="size-4" />
                  </button>
                </TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-mono text-sm">{claim.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback size="sm">
                          {getInitials(claim.advisorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{claim.advisorName}</p>
                        <p className="text-sm text-muted-foreground">{claim.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{claim.businessName}</TableCell>
                  <TableCell className="font-mono text-sm">{claim.afsNumber}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(claim.submittedAt).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{getPriorityBadge(claim.priority)}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/claims/${claim.id}`}>
                            <Eye className="size-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {claim.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="size-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="size-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredClaims.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Search className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No claims found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
