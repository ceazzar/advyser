"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  BarChart3,
  Users,
  Building2,
  Star,
  TrendingUp,
  FileSpreadsheet,
  Loader2,
} from "lucide-react"

// Mock data for reports
const availableReports = [
  {
    id: "RPT-001",
    name: "Advisor Performance Summary",
    description: "Monthly summary of advisor ratings, reviews, and engagement metrics",
    category: "Performance",
    frequency: "Monthly",
    lastGenerated: "2024-01-15T08:00:00",
    format: "PDF",
    status: "ready",
  },
  {
    id: "RPT-002",
    name: "Platform Analytics Overview",
    description: "Comprehensive platform usage statistics and trends",
    category: "Analytics",
    frequency: "Weekly",
    lastGenerated: "2024-01-14T06:00:00",
    format: "PDF",
    status: "ready",
  },
  {
    id: "RPT-003",
    name: "User Registration Report",
    description: "New user registrations breakdown by type and source",
    category: "Users",
    frequency: "Daily",
    lastGenerated: "2024-01-15T00:00:00",
    format: "CSV",
    status: "ready",
  },
  {
    id: "RPT-004",
    name: "Review Moderation Summary",
    description: "Review statistics, moderation actions, and flag reasons",
    category: "Moderation",
    frequency: "Weekly",
    lastGenerated: "2024-01-08T06:00:00",
    format: "PDF",
    status: "outdated",
  },
  {
    id: "RPT-005",
    name: "Claim Processing Report",
    description: "Claim submission and processing statistics",
    category: "Claims",
    frequency: "Weekly",
    lastGenerated: null,
    format: "CSV",
    status: "pending",
  },
  {
    id: "RPT-006",
    name: "Revenue & Subscription Report",
    description: "Subscription revenue, plan distribution, and churn metrics",
    category: "Financial",
    frequency: "Monthly",
    lastGenerated: "2024-01-01T08:00:00",
    format: "PDF",
    status: "ready",
  },
]

const generatedReports = [
  {
    id: "GEN-001",
    name: "Advisor Performance Summary - January 2024",
    reportType: "Advisor Performance Summary",
    generatedAt: "2024-01-15T08:00:00",
    generatedBy: "Admin User",
    size: "2.4 MB",
    format: "PDF",
    status: "completed",
  },
  {
    id: "GEN-002",
    name: "Platform Analytics - Week 2, 2024",
    reportType: "Platform Analytics Overview",
    generatedAt: "2024-01-14T06:00:00",
    generatedBy: "System (Scheduled)",
    size: "1.8 MB",
    format: "PDF",
    status: "completed",
  },
  {
    id: "GEN-003",
    name: "User Registrations - 15 Jan 2024",
    reportType: "User Registration Report",
    generatedAt: "2024-01-15T00:00:00",
    generatedBy: "System (Scheduled)",
    size: "156 KB",
    format: "CSV",
    status: "completed",
  },
  {
    id: "GEN-004",
    name: "Custom Export - Advisor Listings",
    reportType: "Custom Export",
    generatedAt: "2024-01-14T14:30:00",
    generatedBy: "Admin User",
    size: "890 KB",
    format: "CSV",
    status: "completed",
  },
  {
    id: "GEN-005",
    name: "Review Moderation - Week 2, 2024",
    reportType: "Review Moderation Summary",
    generatedAt: "2024-01-15T10:00:00",
    generatedBy: "Admin User",
    size: null,
    format: "PDF",
    status: "generating",
  },
]

const scheduledReports = [
  {
    id: "SCH-001",
    name: "Daily User Registration Report",
    reportType: "User Registration Report",
    frequency: "Daily",
    time: "00:00",
    nextRun: "2024-01-16T00:00:00",
    recipients: ["admin@advyser.com.au"],
    enabled: true,
  },
  {
    id: "SCH-002",
    name: "Weekly Platform Analytics",
    reportType: "Platform Analytics Overview",
    frequency: "Weekly",
    time: "06:00",
    nextRun: "2024-01-21T06:00:00",
    recipients: ["admin@advyser.com.au", "reports@advyser.com.au"],
    enabled: true,
  },
  {
    id: "SCH-003",
    name: "Monthly Performance Summary",
    reportType: "Advisor Performance Summary",
    frequency: "Monthly",
    time: "08:00",
    nextRun: "2024-02-01T08:00:00",
    recipients: ["admin@advyser.com.au"],
    enabled: true,
  },
  {
    id: "SCH-004",
    name: "Weekly Review Summary",
    reportType: "Review Moderation Summary",
    frequency: "Weekly",
    time: "06:00",
    nextRun: "2024-01-21T06:00:00",
    recipients: ["moderation@advyser.com.au"],
    enabled: false,
  },
]

function getCategoryIcon(category: string) {
  switch (category) {
    case "Performance":
      return <TrendingUp className="size-4" />
    case "Analytics":
      return <BarChart3 className="size-4" />
    case "Users":
      return <Users className="size-4" />
    case "Moderation":
      return <Star className="size-4" />
    case "Claims":
      return <FileText className="size-4" />
    case "Financial":
      return <Building2 className="size-4" />
    default:
      return <FileText className="size-4" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "ready":
      return <Badge status="active">Ready</Badge>
    case "outdated":
      return <Badge status="pending">Outdated</Badge>
    case "pending":
      return <Badge status="inactive">Pending</Badge>
    case "completed":
      return <Badge status="active">Completed</Badge>
    case "generating":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Loader2 className="size-3 mr-1 animate-spin" />
          Generating
        </Badge>
      )
    default:
      return <Badge status="inactive">{status}</Badge>
  }
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("available")
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)

  const handleGenerateReport = async (reportId: string) => {
    setGeneratingReport(reportId)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setGeneratingReport(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Exports</h1>
          <p className="text-muted-foreground">
            Generate, schedule, and download platform reports
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Custom Export
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="size-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{availableReports.length}</p>
                <p className="text-sm text-muted-foreground">Report Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="size-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {generatedReports.filter((r) => r.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Generated This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="size-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {scheduledReports.filter((r) => r.enabled).length}
                </p>
                <p className="text-sm text-muted-foreground">Scheduled Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Download className="size-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">Downloads This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="available">Available Reports</TabsTrigger>
              <TabsTrigger value="generated">Generated Reports</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === "available" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableReports.map((report) => (
                <Card key={report.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-muted rounded">
                          {getCategoryIcon(report.category)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{report.name}</CardTitle>
                          <span className="text-xs text-muted-foreground">
                            {report.category}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {report.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="size-4" />
                        <span>{report.frequency}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {report.format}
                      </span>
                    </div>
                    {report.lastGenerated && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last generated:{" "}
                        {new Date(report.lastGenerated).toLocaleDateString("en-AU")}
                      </p>
                    )}
                    <Button
                      className="w-full mt-4"
                      variant={report.status === "ready" ? "default" : "outline"}
                      disabled={generatingReport === report.id}
                      onClick={() => handleGenerateReport(report.id)}
                    >
                      {generatingReport === report.id ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="size-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "generated" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <span className="font-medium">{report.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {report.reportType}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(report.generatedAt).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {report.generatedBy}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {report.size || "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-right">
                      {report.status === "completed" ? (
                        <Button variant="ghost" size="sm">
                          <Download className="size-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Processing
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === "scheduled" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule Name</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledReports.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="font-medium">{schedule.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {schedule.reportType}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {schedule.frequency} at {schedule.time}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(schedule.nextRun).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {schedule.recipients.slice(0, 2).map((email) => (
                          <span
                            key={email}
                            className="text-xs bg-muted px-2 py-0.5 rounded"
                          >
                            {email.split("@")[0]}
                          </span>
                        ))}
                        {schedule.recipients.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{schedule.recipients.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {schedule.enabled ? (
                        <Badge status="active">Active</Badge>
                      ) : (
                        <Badge status="inactive">Paused</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>
            Export platform data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Users className="size-6" />
              <span>Export All Users</span>
              <span className="text-xs text-muted-foreground">CSV Format</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Building2 className="size-6" />
              <span>Export All Listings</span>
              <span className="text-xs text-muted-foreground">CSV Format</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Star className="size-6" />
              <span>Export All Reviews</span>
              <span className="text-xs text-muted-foreground">CSV Format</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileText className="size-6" />
              <span>Export All Claims</span>
              <span className="text-xs text-muted-foreground">CSV Format</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
