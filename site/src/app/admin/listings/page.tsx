"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  ArrowUpDown,
  Download,
  CheckCircle,
  XCircle,
  Building2,
  Users,
} from "lucide-react"
import Link from "next/link"

// Mock data for listings
const mockListings = [
  {
    id: "LST-001",
    businessName: "Johnson Financial Services",
    advisorName: "Sarah Johnson",
    email: "sarah@johnsonfinancial.com.au",
    category: "Financial Planning",
    location: "Melbourne, VIC",
    status: "active" as const,
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    createdAt: "2023-06-15",
    lastUpdated: "2024-01-10",
  },
  {
    id: "LST-002",
    businessName: "Chen Wealth Management",
    advisorName: "Robert Chen",
    email: "robert@chenwm.com.au",
    category: "Wealth Management",
    location: "Sydney, NSW",
    status: "active" as const,
    verified: true,
    rating: 4.9,
    reviewCount: 31,
    createdAt: "2023-05-20",
    lastUpdated: "2024-01-12",
  },
  {
    id: "LST-003",
    businessName: "Lee & Associates",
    advisorName: "Amanda Lee",
    email: "amanda@leeassociates.com.au",
    category: "Tax Planning",
    location: "Brisbane, QLD",
    status: "pending" as const,
    verified: false,
    rating: 0,
    reviewCount: 0,
    createdAt: "2024-01-14",
    lastUpdated: "2024-01-14",
  },
  {
    id: "LST-004",
    businessName: "Miller Advisory Group",
    advisorName: "David Miller",
    email: "david@milleradvisory.com.au",
    category: "Retirement Planning",
    location: "Perth, WA",
    status: "active" as const,
    verified: true,
    rating: 4.5,
    reviewCount: 18,
    createdAt: "2023-08-10",
    lastUpdated: "2024-01-08",
  },
  {
    id: "LST-005",
    businessName: "Taylor Investments",
    advisorName: "Jennifer Taylor",
    email: "jennifer@taylorinvest.com.au",
    category: "Investment Advice",
    location: "Adelaide, SA",
    status: "inactive" as const,
    verified: true,
    rating: 4.2,
    reviewCount: 12,
    createdAt: "2023-04-05",
    lastUpdated: "2023-12-15",
  },
  {
    id: "LST-006",
    businessName: "Brown Financial Planning",
    advisorName: "Michael Brown",
    email: "michael@brownfp.com.au",
    category: "Financial Planning",
    location: "Melbourne, VIC",
    status: "active" as const,
    verified: true,
    rating: 4.7,
    reviewCount: 29,
    createdAt: "2023-03-18",
    lastUpdated: "2024-01-15",
  },
  {
    id: "LST-007",
    businessName: "Watson Wealth Advisors",
    advisorName: "Emily Watson",
    email: "emily@watsonwealth.com.au",
    category: "Estate Planning",
    location: "Hobart, TAS",
    status: "pending" as const,
    verified: false,
    rating: 0,
    reviewCount: 0,
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-10",
  },
  {
    id: "LST-008",
    businessName: "Wilson & Partners",
    advisorName: "James Wilson",
    email: "james@wilsonpartners.com.au",
    category: "Business Advisory",
    location: "Darwin, NT",
    status: "active" as const,
    verified: true,
    rating: 4.6,
    reviewCount: 15,
    createdAt: "2023-07-22",
    lastUpdated: "2024-01-05",
  },
]

const categories = [
  "All Categories",
  "Financial Planning",
  "Wealth Management",
  "Tax Planning",
  "Retirement Planning",
  "Investment Advice",
  "Estate Planning",
  "Business Advisory",
]

function getStatusBadge(status: "active" | "pending" | "inactive") {
  switch (status) {
    case "active":
      return <Badge status="active">Active</Badge>
    case "pending":
      return <Badge status="pending">Pending</Badge>
    case "inactive":
      return <Badge status="inactive">Inactive</Badge>
  }
}

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [deleteListingId, setDeleteListingId] = useState<string | null>(null)

  // Filter and sort listings
  const filteredListings = mockListings
    .filter((listing) => {
      const matchesSearch =
        listing.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.advisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || listing.status === statusFilter
      const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })

  const activeCount = mockListings.filter((l) => l.status === "active").length
  const pendingCount = mockListings.filter((l) => l.status === "pending").length
  const totalReviews = mockListings.reduce((acc, l) => acc + l.reviewCount, 0)

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleDelete = () => {
    // In production, this would call the API
    setDeleteListingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Advisor Listings</h1>
          <p className="text-muted-foreground">
            Manage all advisor listings on the platform
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="size-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building2 className="size-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockListings.length}</p>
                <p className="text-sm text-muted-foreground">Total Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="size-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="size-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="size-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{totalReviews}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="size-4" />}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredListings.length} of {mockListings.length} listings
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("businessName")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Business
                    <ArrowUpDown className="size-4" />
                  </button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("rating")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Rating
                    <ArrowUpDown className="size-4" />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("lastUpdated")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Updated
                    <ArrowUpDown className="size-4" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-mono text-sm">{listing.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback size="sm">
                          {getInitials(listing.businessName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{listing.businessName}</p>
                        <p className="text-sm text-muted-foreground">{listing.advisorName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">
                      {listing.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3" />
                      <span className="text-sm">{listing.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {listing.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{listing.rating}</span>
                        <span className="text-muted-foreground text-sm">
                          ({listing.reviewCount})
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No reviews</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(listing.status)}</TableCell>
                  <TableCell>
                    {listing.verified ? (
                      <CheckCircle className="size-5 text-green-600" />
                    ) : (
                      <XCircle className="size-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(listing.lastUpdated).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                    })}
                  </TableCell>
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
                          <Link href={`/advisors/${listing.id}`}>
                            <Eye className="size-4 mr-2" />
                            View Public Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="size-4 mr-2" />
                          Edit Listing
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {listing.status === "active" ? (
                          <DropdownMenuItem>
                            <XCircle className="size-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <CheckCircle className="size-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteListingId(listing.id)}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete Listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredListings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Building2 className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No listings found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteListingId} onOpenChange={() => setDeleteListingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
              All reviews and data associated with this listing will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Listing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
