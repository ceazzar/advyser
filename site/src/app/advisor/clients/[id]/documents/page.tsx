"use client"

import * as React from "react"
import {
  Upload,
  FileText,
  Download,
  Trash2,
  MoreVertical,
  Search,
  FolderOpen,
  File,
  FileImage,
  FileSpreadsheet,
  Eye,
  Share2,
  Grid,
  List,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Mock documents data
const mockDocuments = [
  {
    id: "1",
    name: "Statement of Advice - Retirement Strategy.pdf",
    type: "pdf",
    category: "SOA",
    size: "2.4 MB",
    uploadedBy: "John Anderson",
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    sharedWithClient: true,
  },
  {
    id: "2",
    name: "Super Statement - December 2025.pdf",
    type: "pdf",
    category: "Statements",
    size: "1.1 MB",
    uploadedBy: "Sarah Mitchell",
    uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    sharedWithClient: true,
  },
  {
    id: "3",
    name: "Risk Profile Questionnaire.pdf",
    type: "pdf",
    category: "Forms",
    size: "340 KB",
    uploadedBy: "John Anderson",
    uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    sharedWithClient: true,
  },
  {
    id: "4",
    name: "Investment Portfolio Analysis.xlsx",
    type: "xlsx",
    category: "Analysis",
    size: "856 KB",
    uploadedBy: "John Anderson",
    uploadedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    sharedWithClient: false,
  },
  {
    id: "5",
    name: "Insurance Policy Summary.pdf",
    type: "pdf",
    category: "Insurance",
    size: "1.8 MB",
    uploadedBy: "Sarah Mitchell",
    uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    sharedWithClient: true,
  },
  {
    id: "6",
    name: "Tax Return 2024-25.pdf",
    type: "pdf",
    category: "Tax",
    size: "3.2 MB",
    uploadedBy: "Sarah Mitchell",
    uploadedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    sharedWithClient: true,
  },
  {
    id: "7",
    name: "ID Verification - Passport.jpg",
    type: "image",
    category: "Identity",
    size: "1.5 MB",
    uploadedBy: "Sarah Mitchell",
    uploadedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    sharedWithClient: false,
  },
]

const categories = [
  "All",
  "SOA",
  "Statements",
  "Forms",
  "Analysis",
  "Insurance",
  "Tax",
  "Identity",
]

const fileTypeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="size-5 text-red-500" />,
  xlsx: <FileSpreadsheet className="size-5 text-green-600" />,
  image: <FileImage className="size-5 text-blue-500" />,
  default: <File className="size-5 text-gray-500" />,
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export default function ClientDocumentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false)

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="size-4" />}
            className="max-w-sm"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <FolderOpen className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="size-4" />
            </Button>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="size-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document for this client
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>File</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop a file here, or click to browse
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Browse Files
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select defaultValue="SOA">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c !== "All").map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="shareWithClient" className="rounded" />
                  <Label htmlFor="shareWithClient" className="text-sm font-normal">
                    Share with client
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsUploadDialogOpen(false)}>
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Documents */}
      {filteredDocuments.length > 0 ? (
        viewMode === "list" ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Shared</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {fileTypeIcons[doc.type] || fileTypeIcons.default}
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-muted text-muted-foreground">
                          {doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.size}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex flex-col">
                          <span>{formatDate(doc.uploadedAt)}</span>
                          <span className="text-xs">by {doc.uploadedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.sharedWithClient ? (
                          <Badge className="bg-green-100 text-green-800">Shared</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600">Private</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="size-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="size-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="size-4 mr-2" />
                              {doc.sharedWithClient ? "Unshare" : "Share with Client"}
                            </DropdownMenuItem>
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                        {fileTypeIcons[doc.type] || fileTypeIcons.default}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="size-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="size-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="font-medium text-sm line-clamp-2">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>-</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge className="bg-muted text-muted-foreground" size="sm">
                      {doc.category}
                    </Badge>
                    {doc.sharedWithClient && (
                      <Share2 className="size-3.5 text-green-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <EmptyState
          icon={<FileText />}
          title="No documents found"
          description={
            searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search or filter"
              : "Upload documents to get started"
          }
          action={
            !searchQuery && selectedCategory === "All"
              ? {
                  label: "Upload Document",
                  onClick: () => setIsUploadDialogOpen(true),
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
