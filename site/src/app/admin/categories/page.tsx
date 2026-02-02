"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  FolderTree,
  Building2,
  Eye,
  EyeOff,
  GripVertical,
  ChevronRight,
  Layers,
} from "lucide-react"

// Mock data for categories
const mockCategories = [
  {
    id: "CAT-001",
    name: "Financial Planning",
    slug: "financial-planning",
    description: "Comprehensive financial planning and wealth management services",
    parentId: null,
    listingCount: 487,
    status: "active" as const,
    featured: true,
    order: 1,
    createdAt: "2023-01-15",
  },
  {
    id: "CAT-002",
    name: "Retirement Planning",
    slug: "retirement-planning",
    description: "Specialised retirement and superannuation advice",
    parentId: "CAT-001",
    listingCount: 156,
    status: "active" as const,
    featured: false,
    order: 1,
    createdAt: "2023-01-15",
  },
  {
    id: "CAT-003",
    name: "Wealth Management",
    slug: "wealth-management",
    description: "Investment portfolio management and wealth building strategies",
    parentId: null,
    listingCount: 312,
    status: "active" as const,
    featured: true,
    order: 2,
    createdAt: "2023-01-15",
  },
  {
    id: "CAT-004",
    name: "Tax Planning",
    slug: "tax-planning",
    description: "Tax minimisation strategies and compliance advice",
    parentId: null,
    listingCount: 224,
    status: "active" as const,
    featured: false,
    order: 3,
    createdAt: "2023-02-01",
  },
  {
    id: "CAT-005",
    name: "Estate Planning",
    slug: "estate-planning",
    description: "Wills, trusts, and estate management services",
    parentId: null,
    listingCount: 189,
    status: "active" as const,
    featured: false,
    order: 4,
    createdAt: "2023-02-15",
  },
  {
    id: "CAT-006",
    name: "Investment Advice",
    slug: "investment-advice",
    description: "Stock market, bonds, and alternative investment guidance",
    parentId: "CAT-003",
    listingCount: 201,
    status: "active" as const,
    featured: false,
    order: 1,
    createdAt: "2023-02-15",
  },
  {
    id: "CAT-007",
    name: "Insurance Advice",
    slug: "insurance-advice",
    description: "Life, income protection, and general insurance advice",
    parentId: null,
    listingCount: 167,
    status: "active" as const,
    featured: false,
    order: 5,
    createdAt: "2023-03-01",
  },
  {
    id: "CAT-008",
    name: "Business Advisory",
    slug: "business-advisory",
    description: "Financial advice for business owners and entrepreneurs",
    parentId: null,
    listingCount: 134,
    status: "active" as const,
    featured: true,
    order: 6,
    createdAt: "2023-03-15",
  },
  {
    id: "CAT-009",
    name: "SMSF Advice",
    slug: "smsf-advice",
    description: "Self-managed superannuation fund setup and management",
    parentId: "CAT-002",
    listingCount: 98,
    status: "active" as const,
    featured: false,
    order: 1,
    createdAt: "2023-04-01",
  },
  {
    id: "CAT-010",
    name: "Mortgage Broking",
    slug: "mortgage-broking",
    description: "Home loan and property finance advice",
    parentId: null,
    listingCount: 0,
    status: "inactive" as const,
    featured: false,
    order: 7,
    createdAt: "2023-05-01",
  },
]

interface CategoryFormData {
  name: string
  slug: string
  description: string
  parentId: string | null
  status: "active" | "inactive"
  featured: boolean
}

const initialFormData: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  parentId: null,
  status: "active",
  featured: false,
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<typeof mockCategories[0] | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<typeof mockCategories[0] | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData)

  // Filter categories
  const filteredCategories = mockCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get parent categories (categories without parentId)
  const parentCategories = mockCategories.filter((c) => !c.parentId)

  // Get children for a parent
  const getChildren = (parentId: string) =>
    mockCategories.filter((c) => c.parentId === parentId)

  // Generate slug from name
  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = () => {
    setShowAddDialog(false)
    setEditingCategory(null)
    setFormData(initialFormData)
  }

  const handleEdit = (category: typeof mockCategories[0]) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      status: category.status,
      featured: category.featured,
    })
    setEditingCategory(category)
  }

  const handleDelete = () => {
    setDeletingCategory(null)
  }

  const totalListings = mockCategories.reduce((acc, c) => acc + c.listingCount, 0)
  const activeCategories = mockCategories.filter((c) => c.status === "active").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">
            Manage advisor categories and specialisations
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="size-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FolderTree className="size-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockCategories.length}</p>
                <p className="text-sm text-muted-foreground">Total Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Layers className="size-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{parentCategories.length}</p>
                <p className="text-sm text-muted-foreground">Parent Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Eye className="size-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeCategories}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building2 className="size-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalListings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="size-4" />}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredCategories.length} categories
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="text-center">Listings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => {
                const parent = category.parentId
                  ? mockCategories.find((c) => c.id === category.parentId)
                  : null

                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {category.parentId && (
                          <ChevronRight className="size-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {parent?.name || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{category.listingCount}</span>
                    </TableCell>
                    <TableCell>
                      {category.status === "active" ? (
                        <Badge status="active">Active</Badge>
                      ) : (
                        <Badge status="inactive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {category.featured && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          Featured
                        </Badge>
                      )}
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
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="size-4 mr-2" />
                            Edit Category
                          </DropdownMenuItem>
                          {category.status === "active" ? (
                            <DropdownMenuItem>
                              <EyeOff className="size-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Eye className="size-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeletingCategory(category)}
                            disabled={category.listingCount > 0}
                          >
                            <Trash2 className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <FolderTree className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No categories found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={showAddDialog || !!editingCategory}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false)
            setEditingCategory(null)
            setFormData(initialFormData)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below."
                : "Create a new category for advisor listings."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category Name</label>
              <Input
                placeholder="e.g. Financial Planning"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">URL Slug</label>
              <Input
                placeholder="e.g. financial-planning"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL: /advisors/category/{formData.slug || "..."}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Brief description of this category..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Parent Category</label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    parentId: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent (Top Level)</SelectItem>
                  {parentCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Featured</label>
                <Select
                  value={formData.featured ? "yes" : "no"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, featured: value === "yes" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setEditingCategory(null)
                setFormData(initialFormData)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCategory?.name}&quot;? This
              action cannot be undone.
              {deletingCategory && deletingCategory.listingCount > 0 && (
                <span className="block mt-2 text-destructive">
                  Warning: This category has {deletingCategory.listingCount} listings
                  associated with it.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
