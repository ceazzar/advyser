"use client"

import * as React from "react"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Mock client detail data
const mockClientDetail = {
  contact: {
    email: "sarah.mitchell@email.com",
    phone: "+61 412 345 678",
    location: "Sydney, NSW",
  },
  financialProfile: {
    riskProfile: "Balanced",
    investableAssets: "$650,000",
    superBalance: "$520,000",
    annualIncome: "$145,000",
    employmentStatus: "Full-time employed",
    age: 58,
    retirementAge: 65,
  },
  engagement: {
    lastContact: "2 days ago",
    totalMeetings: 12,
    documentsShared: 8,
    openTasks: 3,
  },
  goals: [
    {
      id: "1",
      title: "Retire comfortably at 65",
      progress: 72,
      status: "on-track",
    },
    {
      id: "2",
      title: "Build emergency fund ($30k)",
      progress: 85,
      status: "on-track",
    },
    {
      id: "3",
      title: "Pay off investment property",
      progress: 45,
      status: "at-risk",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "meeting",
      description: "Quarterly review meeting completed",
      date: "2 days ago",
    },
    {
      id: "2",
      type: "document",
      description: "SOA document uploaded",
      date: "1 week ago",
    },
    {
      id: "3",
      type: "message",
      description: "Discussed super consolidation options",
      date: "2 weeks ago",
    },
    {
      id: "4",
      type: "task",
      description: "Insurance review completed",
      date: "3 weeks ago",
    },
  ],
  upcomingTasks: [
    {
      id: "1",
      title: "Annual review preparation",
      dueDate: "Feb 15, 2026",
      priority: "high",
    },
    {
      id: "2",
      title: "Update risk profile questionnaire",
      dueDate: "Feb 20, 2026",
      priority: "medium",
    },
    {
      id: "3",
      title: "Review insurance coverage",
      dueDate: "Mar 1, 2026",
      priority: "low",
    },
  ],
}

const activityIcons: Record<string, React.ReactNode> = {
  meeting: <Calendar className="size-4 text-blue-600" />,
  document: <FileText className="size-4 text-purple-600" />,
  message: <Mail className="size-4 text-green-600" />,
  task: <AlertCircle className="size-4 text-orange-600" />,
}

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-600",
}

export default function ClientOverviewPage() {
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      {/* Left Column - Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Mail className="size-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <a
                    href={`mailto:${mockClientDetail.contact.email}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {mockClientDetail.contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Phone className="size-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Phone</span>
                  <a
                    href={`tel:${mockClientDetail.contact.phone}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {mockClientDetail.contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <MapPin className="size-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Location</span>
                  <span className="text-sm font-medium">
                    {mockClientDetail.contact.location}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="size-5" />
              Financial Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Risk Profile
                </span>
                <p className="text-lg font-semibold">
                  {mockClientDetail.financialProfile.riskProfile}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Investable Assets
                </span>
                <p className="text-lg font-semibold">
                  {mockClientDetail.financialProfile.investableAssets}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Super Balance
                </span>
                <p className="text-lg font-semibold">
                  {mockClientDetail.financialProfile.superBalance}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Annual Income
                </span>
                <p className="text-lg font-semibold">
                  {mockClientDetail.financialProfile.annualIncome}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Employment
                </span>
                <p className="text-lg font-semibold">
                  {mockClientDetail.financialProfile.employmentStatus}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Target Retirement
                </span>
                <p className="text-lg font-semibold">
                  Age {mockClientDetail.financialProfile.retirementAge} (
                  {mockClientDetail.financialProfile.retirementAge -
                    mockClientDetail.financialProfile.age}{" "}
                  years)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="size-5" />
              Financial Goals
            </CardTitle>
            <CardDescription>
              Track progress towards client objectives
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {mockClientDetail.goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal.title}</span>
                    <Badge
                      className={
                        goal.status === "on-track"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {goal.status === "on-track" ? "On Track" : "At Risk"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={goal.progress} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-12">
                      {goal.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Activity & Tasks */}
      <div className="space-y-6">
        {/* Engagement Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Engagement</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Last Contact</span>
                </div>
                <p className="font-semibold">{mockClientDetail.engagement.lastContact}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total Meetings</span>
                </div>
                <p className="font-semibold">{mockClientDetail.engagement.totalMeetings}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Documents</span>
                </div>
                <p className="font-semibold">{mockClientDetail.engagement.documentsShared}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Open Tasks</span>
                </div>
                <p className="font-semibold">{mockClientDetail.engagement.openTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {mockClientDetail.upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-2 p-3 rounded-lg border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">Due {task.dueDate}</p>
                  </div>
                  <Badge className={priorityColors[task.priority]} size="sm">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockClientDetail.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {activityIcons[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
