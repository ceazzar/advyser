"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Flag,
  Star,
  ArrowUpDown,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Trash2,
} from "lucide-react"

// Mock data for reviews
const mockReviews = [
  {
    id: "REV-001",
    reviewerName: "John Smith",
    reviewerEmail: "john.smith@email.com",
    advisorName: "Sarah Johnson",
    businessName: "Johnson Financial Services",
    rating: 5,
    title: "Excellent financial advice",
    content: "Sarah provided exceptional guidance on my retirement planning. Her expertise and professionalism made a significant difference in my financial future.",
    status: "approved" as const,
    flagged: false,
    flagReason: null,
    createdAt: "2024-01-15T10:30:00",
    helpful: 12,
  },
  {
    id: "REV-002",
    reviewerName: "Anonymous User",
    reviewerEmail: "anonymous@email.com",
    advisorName: "James Wilson",
    businessName: "Wilson & Partners",
    rating: 1,
    title: "Terrible experience",
    content: "This advisor is a SCAM! DO NOT USE! They stole my money and never delivered results. AVOID AT ALL COSTS!!!!",
    status: "flagged" as const,
    flagged: true,
    flagReason: "Potential spam/defamatory content",
    createdAt: "2024-01-15T09:15:00",
    helpful: 0,
  },
  {
    id: "REV-003",
    reviewerName: "Mark Thompson",
    reviewerEmail: "mark.t@email.com",
    advisorName: "Lisa Anderson",
    businessName: "Anderson Financial",
    rating: 2,
    title: "Disappointing service",
    content: "The advice was okay but the #@$% customer service was absolutely %$#@! Would not recommend this $#@% place.",
    status: "flagged" as const,
    flagged: true,
    flagReason: "Inappropriate language",
    createdAt: "2024-01-14T16:45:00",
    helpful: 1,
  },
  {
    id: "REV-004",
    reviewerName: "Emily Davis",
    reviewerEmail: "emily.d@email.com",
    advisorName: "Robert Chen",
    businessName: "Chen Wealth Management",
    rating: 4,
    title: "Good overall experience",
    content: "Robert was knowledgeable and helpful. The only downside was the wait time for appointments.",
    status: "approved" as const,
    flagged: false,
    flagReason: null,
    createdAt: "2024-01-14T11:20:00",
    helpful: 8,
  },
  {
    id: "REV-005",
    reviewerName: "David Brown",
    reviewerEmail: "david.b@email.com",
    advisorName: "Amanda Lee",
    businessName: "Lee & Associates",
    rating: 5,
    title: "Highly recommend!",
    content: "Amanda helped me restructure my investment portfolio with great results. Very professional and responsive.",
    status: "pending" as const,
    flagged: false,
    flagReason: null,
    createdAt: "2024-01-13T14:00:00",
    helpful: 0,
  },
  {
    id: "REV-006",
    reviewerName: "Competitor Business",
    reviewerEmail: "info@competitorco.com",
    advisorName: "Michael Brown",
    businessName: "Brown Financial Planning",
    rating: 1,
    title: "Avoid this advisor",
    content: "They use outdated practices. Better to use CompetitorCo for all your financial needs. Visit competitorco.com for better service.",
    status: "flagged" as const,
    flagged: true,
    flagReason: "Suspected competitor review",
    createdAt: "2024-01-12T08:30:00",
    helpful: 0,
  },
  {
    id: "REV-007",
    reviewerName: "Susan White",
    reviewerEmail: "susan.w@email.com",
    advisorName: "Jennifer Taylor",
    businessName: "Taylor Investments",
    rating: 3,
    title: "Average experience",
    content: "The service was okay, nothing exceptional. Fees were a bit higher than expected.",
    status: "approved" as const,
    flagged: false,
    flagReason: null,
    createdAt: "2024-01-11T17:45:00",
    helpful: 3,
  },
  {
    id: "REV-008",
    reviewerName: "Alex Johnson",
    reviewerEmail: "alex.j@email.com",
    advisorName: "David Miller",
    businessName: "Miller Advisory Group",
    rating: 5,
    title: "Outstanding service",
    content: "David went above and beyond to help me understand my options. Truly a professional in every sense.",
    status: "pending" as const,
    flagged: false,
    flagReason: null,
    createdAt: "2024-01-10T12:15:00",
    helpful: 0,
  },
]

function getStatusBadge(status: "pending" | "approved" | "flagged" | "rejected") {
  switch (status) {
    case "pending":
      return <Badge status="pending">Pending</Badge>
    case "approved":
      return <Badge status="active">Approved</Badge>
    case "flagged":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <Flag className="size-3 mr-1" />
          Flagged
        </Badge>
      )
    case "rejected":
      return <Badge status="inactive">Rejected</Badge>
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<typeof mockReviews[0] | null>(null)
  const [moderationNote, setModerationNote] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter reviews
  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.advisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || review.status === statusFilter

    const matchesRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter)

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && review.status === "pending") ||
      (activeTab === "flagged" && review.flagged)

    return matchesSearch && matchesStatus && matchesRating && matchesTab
  })

  const pendingCount = mockReviews.filter((r) => r.status === "pending").length
  const flaggedCount = mockReviews.filter((r) => r.flagged).length
  const approvedCount = mockReviews.filter((r) => r.status === "approved").length

  const handleApprove = (reviewId: string) => {
    setSelectedReview(null)
    setModerationNote("")
  }

  const handleReject = (reviewId: string) => {
    setSelectedReview(null)
    setModerationNote("")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Review Moderation</h1>
        <p className="text-muted-foreground">
          Review and moderate user-submitted reviews
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockReviews.length}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
                <p className="text-sm text-yellow-700">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Flag className="size-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{flaggedCount}</p>
                <p className="text-sm text-red-700">Flagged</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
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
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="flagged">
                  Flagged ({flaggedCount})
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative max-w-xs">
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="size-4" />}
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Advisor</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id} className={review.flagged ? "bg-red-50/50" : ""}>
                  <TableCell className="font-mono text-sm">{review.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback size="sm">
                          {getInitials(review.reviewerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{review.reviewerName}</p>
                        <p className="text-xs text-muted-foreground">{review.reviewerEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{review.advisorName}</p>
                      <p className="text-xs text-muted-foreground">{review.businessName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} />
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="font-medium text-sm truncate">{review.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{review.content}</p>
                    {review.flagReason && (
                      <p className="text-xs text-red-600 mt-1">
                        <Flag className="size-3 inline mr-1" />
                        {review.flagReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(review.createdAt).toLocaleDateString("en-AU", {
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
                        <DropdownMenuItem onClick={() => setSelectedReview(review)}>
                          <Eye className="size-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {(review.status === "pending" || review.status === "flagged") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => handleApprove(review.id)}
                            >
                              <ThumbsUp className="size-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedReview(review)
                              }}
                            >
                              <ThumbsDown className="size-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <MessageSquare className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No reviews found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl">
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle>Review Details</DialogTitle>
                <DialogDescription>
                  Review ID: {selectedReview.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Reviewer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(selectedReview.reviewerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedReview.reviewerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedReview.reviewerEmail}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(selectedReview.status)}
                </div>

                {/* Review Target */}
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Review for:</p>
                  <p className="font-medium">{selectedReview.advisorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.businessName}
                  </p>
                </div>

                {/* Rating and Content */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={selectedReview.rating} />
                    <span className="text-sm text-muted-foreground">
                      {selectedReview.rating} out of 5
                    </span>
                  </div>
                  <h4 className="font-medium mb-1">{selectedReview.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.content}
                  </p>
                </div>

                {/* Flag Reason */}
                {selectedReview.flagReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 text-red-800">
                      <Flag className="size-4" />
                      <span className="font-medium">Flagged:</span>
                      <span>{selectedReview.flagReason}</span>
                    </div>
                  </div>
                )}

                {/* Moderation Note */}
                {(selectedReview.status === "pending" || selectedReview.status === "flagged") && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Moderation Note (optional)
                    </label>
                    <Textarea
                      placeholder="Add a note about your moderation decision..."
                      value={moderationNote}
                      onChange={(e) => setModerationNote(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                {(selectedReview.status === "pending" || selectedReview.status === "flagged") ? (
                  <>
                    <Button variant="outline" onClick={() => setSelectedReview(null)}>
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedReview.id)}
                    >
                      <XCircle className="size-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={() => handleApprove(selectedReview.id)}>
                      <CheckCircle className="size-4 mr-2" />
                      Approve
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setSelectedReview(null)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
