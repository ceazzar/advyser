"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

// Mock claim data - in production this would come from API
const mockClaimDetails = {
  "CLM-001": {
    id: "CLM-001",
    status: "pending" as const,
    priority: "high",
    submittedAt: "2024-01-15T10:30:00",
    advisor: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+61 412 345 678",
      linkedIn: "https://linkedin.com/in/sarahjohnson",
    },
    business: {
      name: "Johnson Financial Services",
      abn: "12 345 678 901",
      address: "Level 15, 123 Collins Street, Melbourne VIC 3000",
      website: "https://johnsonfinancial.com.au",
    },
    license: {
      afsNumber: "AFS123456",
      authorizedRep: "AR001234",
      licensee: "Self-Licensed",
      expiryDate: "2025-12-31",
    },
    documents: [
      { id: "doc-1", name: "AFSL Certificate.pdf", size: "245 KB", uploadedAt: "2024-01-15T10:25:00" },
      { id: "doc-2", name: "Proof of Identity.pdf", size: "1.2 MB", uploadedAt: "2024-01-15T10:26:00" },
      { id: "doc-3", name: "Professional Indemnity Insurance.pdf", size: "890 KB", uploadedAt: "2024-01-15T10:28:00" },
    ],
    verificationNotes: "",
    activityLog: [
      { id: "act-1", action: "Claim submitted", user: "Sarah Johnson", timestamp: "2024-01-15T10:30:00" },
      { id: "act-2", action: "Documents uploaded", user: "Sarah Johnson", timestamp: "2024-01-15T10:28:00" },
      { id: "act-3", action: "Auto-verification started", user: "System", timestamp: "2024-01-15T10:31:00" },
      { id: "act-4", action: "AFS number verified against ASIC register", user: "System", timestamp: "2024-01-15T10:32:00" },
    ],
    listing: {
      id: "LST-2847",
      title: "Johnson Financial Services",
      category: "Financial Planning",
      createdAt: "2023-06-15",
    },
  },
}

function getStatusBadge(status: "pending" | "approved" | "rejected") {
  switch (status) {
    case "pending":
      return <Badge status="pending">Pending Review</Badge>
    case "approved":
      return <Badge status="verified">Approved</Badge>
    case "rejected":
      return <Badge status="inactive">Rejected</Badge>
  }
}

export default function ClaimDetailPage() {
  const params = useParams()
  const router = useRouter()
  const claimId = params.id as string

  const [notes, setNotes] = useState("")
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Get claim details (mock - would be API call)
  const claim = mockClaimDetails["CLM-001"] // Always use mock data for demo

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="size-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-foreground">Claim not found</p>
        <p className="text-muted-foreground mb-4">
          The claim you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/admin/claims">Back to Claims</Link>
        </Button>
      </div>
    )
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setShowApproveDialog(false)
    router.push("/admin/claims")
  }

  const handleReject = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setShowRejectDialog(false)
    router.push("/admin/claims")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/claims">
              <ArrowLeft className="size-4 mr-2" />
              Back to Claims
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Claim {claim.id}</h1>
              {getStatusBadge(claim.status)}
            </div>
            <p className="text-muted-foreground">
              Submitted {new Date(claim.submittedAt).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {claim.status === "pending" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
            >
              <XCircle className="size-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => setShowApproveDialog(true)}>
              <CheckCircle className="size-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents ({claim.documents.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Advisor Information */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <User className="size-5" />
                    Advisor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar size="lg">
                      <AvatarFallback size="lg">
                        {getInitials(claim.advisor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{claim.advisor.name}</h3>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="size-4 text-muted-foreground" />
                          <a href={`mailto:${claim.advisor.email}`} className="text-primary hover:underline">
                            {claim.advisor.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-4 text-muted-foreground" />
                          <span>{claim.advisor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:col-span-2">
                          <ExternalLink className="size-4 text-muted-foreground" />
                          <a href={claim.advisor.linkedIn} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            LinkedIn Profile
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="size-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{claim.business.name}</h3>
                      <p className="text-sm text-muted-foreground">ABN: {claim.business.abn}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="size-4 text-muted-foreground mt-0.5" />
                        <span>{claim.business.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="size-4 text-muted-foreground" />
                        <a href={claim.business.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {claim.business.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* License Information */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5" />
                    License Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">AFS Number</p>
                      <p className="font-mono font-medium">{claim.license.afsNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Authorized Rep Number</p>
                      <p className="font-mono font-medium">{claim.license.authorizedRep}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Licensee</p>
                      <p className="font-medium">{claim.license.licensee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License Expiry</p>
                      <p className="font-medium">{new Date(claim.license.expiryDate).toLocaleDateString("en-AU")}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        AFS Number verified against ASIC register
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Uploaded Documents</CardTitle>
                  <CardDescription>
                    Review the documents submitted with this claim
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {claim.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded">
                            <FileText className="size-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.size} - Uploaded {new Date(doc.uploadedAt).toLocaleTimeString("en-AU", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="size-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Timeline of actions related to this claim
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative">
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-6">
                      {claim.activityLog.map((activity, index) => (
                        <div key={activity.id} className="flex gap-4 relative">
                          <div className="relative z-10 flex size-8 items-center justify-center rounded-full bg-background border">
                            <Clock className="size-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              by {activity.user} - {new Date(activity.timestamp).toLocaleString("en-AU")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Actions & Notes */}
        <div className="space-y-6">
          {/* Linked Listing */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Linked Listing</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="font-medium">{claim.listing.title}</p>
                <p className="text-sm text-muted-foreground">{claim.listing.category}</p>
                <p className="text-sm text-muted-foreground">
                  Listed since {new Date(claim.listing.createdAt).toLocaleDateString("en-AU")}
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                  <Link href={`/admin/listings/${claim.listing.id}`}>
                    View Listing
                    <ExternalLink className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Verification Notes */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Verification Notes</CardTitle>
              <CardDescription>
                Add internal notes about this claim
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                placeholder="Add notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
              <Button variant="outline" size="sm" className="w-full mt-3">
                Save Notes
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {claim.status === "pending" && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => setShowApproveDialog(true)}
                >
                  <CheckCircle className="size-4 mr-2" />
                  Approve Claim
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="size-4 mr-2" />
                  Reject Claim
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Claim Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this claim? This will grant {claim.advisor.name} ownership of the listing &quot;{claim.listing.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Approve Claim"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Claim Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this claim? The advisor will be notified via email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for rejection (optional)..."
              className="min-h-[80px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? "Processing..." : "Reject Claim"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
