"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  DollarSign,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock lead data - in production, fetch by ID
const mockLead = {
  id: "1",
  consumerName: "Sarah Mitchell",
  email: "sarah.mitchell@email.com",
  phone: "+61 412 345 678",
  location: "Sydney, NSW",
  category: "Retirement Planning",
  status: "new" as const,
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  message:
    "I'm looking for advice on transitioning to retirement. I'm 58 years old and want to understand my options for accessing my super and planning for the next 10 years. I currently have around $650,000 in superannuation and own my home outright. My main concerns are ensuring I have enough income to maintain my lifestyle and understanding the tax implications of different strategies.",
  preferences: {
    meetingType: "Video call",
    availability: "Weekday mornings",
    urgency: "Within 2 weeks",
  },
  additionalInfo: {
    age: 58,
    employmentStatus: "Full-time employed",
    annualIncome: "$120,000 - $150,000",
    existingAdviser: "No",
  },
}

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  declined: "Declined",
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [responseMessage, setResponseMessage] = React.useState("")
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = React.useState(false)
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = React.useState(false)
  const [declineReason, setDeclineReason] = React.useState("")

  const handleAccept = () => {
    // In production, call API to accept lead
    setIsAcceptDialogOpen(false)
    // Navigate to messages or show success
  }

  const handleDecline = () => {
    // In production, call API to decline lead
    setIsDeclineDialogOpen(false)
    router.push("/advisor/leads")
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/advisor/leads">
            <ArrowLeft className="size-4" />
            Back to Leads
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar size="lg">
              <AvatarFallback size="lg">
                {getInitials(mockLead.consumerName || "Anonymous")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {mockLead.consumerName || "Anonymous Lead"}
                </h1>
                <Badge leadStatus={mockLead.status} size="default">
                  {statusLabels[mockLead.status]}
                </Badge>
              </div>
              <p className="text-muted-foreground">{mockLead.category}</p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                <span>Received {formatDate(mockLead.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {mockLead.status === "new" && (
            <div className="flex items-center gap-2">
              <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <XCircle className="size-4" />
                    Decline
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Decline Lead</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to decline this lead? You can optionally provide a reason.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Reason for declining (optional)..."
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  />
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsDeclineDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDecline}>
                      Decline Lead
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CheckCircle className="size-4" />
                    Accept & Respond
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Accept Lead & Send Response</DialogTitle>
                    <DialogDescription>
                      Write a personalized response to {mockLead.consumerName || "this lead"}.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Write your response message..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsAcceptDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAccept} disabled={!responseMessage.trim()}>
                      Accept & Send
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-5" />
                Lead Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {mockLead.message}
              </p>
            </CardContent>
          </Card>

          {/* Meeting Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Meeting Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Preferred Format
                  </span>
                  <span className="text-sm font-medium">
                    {mockLead.preferences.meetingType}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Availability
                  </span>
                  <span className="text-sm font-medium">
                    {mockLead.preferences.availability}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Timeline
                  </span>
                  <span className="text-sm font-medium">
                    {mockLead.preferences.urgency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Age</span>
                    <span className="text-sm font-medium">
                      {mockLead.additionalInfo.age} years old
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Briefcase className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Employment</span>
                    <span className="text-sm font-medium">
                      {mockLead.additionalInfo.employmentStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <DollarSign className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Annual Income</span>
                    <span className="text-sm font-medium">
                      {mockLead.additionalInfo.annualIncome}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Existing Adviser</span>
                    <span className="text-sm font-medium">
                      {mockLead.additionalInfo.existingAdviser}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Available after accepting the lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Mail className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Email</span>
                    {mockLead.status === "new" ? (
                      <span className="text-sm text-muted-foreground italic">
                        Hidden until accepted
                      </span>
                    ) : (
                      <a
                        href={`mailto:${mockLead.email}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {mockLead.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Phone className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Phone</span>
                    {mockLead.status === "new" ? (
                      <span className="text-sm text-muted-foreground italic">
                        Hidden until accepted
                      </span>
                    ) : (
                      <a
                        href={`tel:${mockLead.phone}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {mockLead.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <MapPin className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Location</span>
                    <span className="text-sm font-medium">{mockLead.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {mockLead.status !== "new" && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="size-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="size-4" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="size-4" />
                  Convert to Client
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
