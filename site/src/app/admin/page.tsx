"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Building2,
  FileCheck,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

// Mock data for dashboard
const platformStats = {
  totalAdvisors: 2847,
  activeListings: 2134,
  pendingClaims: 23,
  averageRating: 4.6,
  advisorGrowth: 12.5,
  listingGrowth: 8.3,
  claimChange: -15.2,
  ratingChange: 2.1,
}

const recentActivity = [
  {
    id: "1",
    type: "claim",
    message: "New claim request from Sarah Johnson for listing #2847",
    timestamp: "2 minutes ago",
    user: { name: "Sarah Johnson", avatar: null },
  },
  {
    id: "2",
    type: "review",
    message: "New review submitted for James Chen - requires moderation",
    timestamp: "15 minutes ago",
    user: { name: "Michael Brown", avatar: null },
  },
  {
    id: "3",
    type: "listing",
    message: "Advisor profile updated: Emily Watson - Financial Planning",
    timestamp: "32 minutes ago",
    user: { name: "Emily Watson", avatar: null },
  },
  {
    id: "4",
    type: "report",
    message: "Weekly analytics report generated successfully",
    timestamp: "1 hour ago",
    user: { name: "System", avatar: null },
  },
  {
    id: "5",
    type: "claim",
    message: "Claim approved for David Miller - listing #1923",
    timestamp: "2 hours ago",
    user: { name: "Admin", avatar: null },
  },
]

const pendingClaims = [
  {
    id: "CLM-001",
    advisorName: "Sarah Johnson",
    businessName: "Johnson Financial Services",
    submittedAt: "2024-01-15",
    status: "pending",
  },
  {
    id: "CLM-002",
    advisorName: "Robert Chen",
    businessName: "Chen Wealth Management",
    submittedAt: "2024-01-14",
    status: "pending",
  },
  {
    id: "CLM-003",
    advisorName: "Amanda Lee",
    businessName: "Lee & Associates",
    submittedAt: "2024-01-14",
    status: "pending",
  },
]

const flaggedReviews = [
  {
    id: "REV-001",
    reviewer: "Anonymous User",
    advisorName: "James Wilson",
    rating: 1,
    reason: "Potential spam content",
    flaggedAt: "2024-01-15",
  },
  {
    id: "REV-002",
    reviewer: "Mark Thompson",
    advisorName: "Lisa Anderson",
    rating: 2,
    reason: "Inappropriate language",
    flaggedAt: "2024-01-14",
  },
]

function getActivityIcon(type: string) {
  switch (type) {
    case "claim":
      return <FileCheck className="size-4 text-blue-500" />
    case "review":
      return <Star className="size-4 text-yellow-500" />
    case "listing":
      return <Building2 className="size-4 text-green-500" />
    case "report":
      return <TrendingUp className="size-4 text-purple-500" />
    default:
      return <Clock className="size-4 text-gray-500" />
  }
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening on the platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Advisors"
          value={platformStats.totalAdvisors.toLocaleString()}
          change={{
            value: platformStats.advisorGrowth,
            type: "increase",
          }}
          icon={<Users className="size-5" />}
        />
        <StatCard
          label="Active Listings"
          value={platformStats.activeListings.toLocaleString()}
          change={{
            value: platformStats.listingGrowth,
            type: "increase",
          }}
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          label="Pending Claims"
          value={platformStats.pendingClaims}
          change={{
            value: Math.abs(platformStats.claimChange),
            type: "decrease",
          }}
          icon={<FileCheck className="size-5" />}
        />
        <StatCard
          label="Average Rating"
          value={platformStats.averageRating.toFixed(1)}
          change={{
            value: platformStats.ratingChange,
            type: "increase",
          }}
          icon={<Star className="size-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events and actions</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-muted p-2">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Claims */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Claims</CardTitle>
                <CardDescription>Advisor claim requests awaiting review</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/claims">
                  View All <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Advisor</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback size="sm">
                            {getInitials(claim.advisorName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{claim.advisorName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {claim.businessName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(claim.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge status="pending">Pending</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Reviews Section */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 text-destructive" />
              <div>
                <CardTitle>Flagged Reviews</CardTitle>
                <CardDescription>Reviews requiring moderation attention</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/reviews">
                View All <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review ID</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Advisor</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Flagged Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flaggedReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-mono text-sm">{review.id}</TableCell>
                  <TableCell>{review.reviewer}</TableCell>
                  <TableCell>{review.advisorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span>{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      {review.reason}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(review.flaggedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/reviews?id=${review.id}`}>Review</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
