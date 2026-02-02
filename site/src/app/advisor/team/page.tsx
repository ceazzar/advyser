"use client"

import * as React from "react"
import {
  Plus,
  MoreVertical,
  Mail,
  Shield,
  UserMinus,
  UserCog,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { EmptyState } from "@/components/ui/empty-state"

// Mock team data
const mockTeamMembers = [
  {
    id: "1",
    name: "John Anderson",
    email: "john@andersonfinancial.com.au",
    role: "admin",
    status: "active",
    avatar: undefined,
    lastActive: "2 minutes ago",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@andersonfinancial.com.au",
    role: "advisor",
    status: "active",
    avatar: undefined,
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@andersonfinancial.com.au",
    role: "advisor",
    status: "active",
    avatar: undefined,
    lastActive: "3 hours ago",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@andersonfinancial.com.au",
    role: "support",
    status: "active",
    avatar: undefined,
    lastActive: "Yesterday",
  },
  {
    id: "5",
    name: "Robert Taylor",
    email: "robert@andersonfinancial.com.au",
    role: "advisor",
    status: "pending",
    avatar: undefined,
    lastActive: "Pending invitation",
  },
]

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  advisor: "Adviser",
  support: "Support Staff",
}

const roleDescriptions: Record<string, string> = {
  admin: "Full access to all features and settings",
  advisor: "Manage clients, leads, and appointments",
  support: "View-only access with limited client interaction",
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState("advisor")

  const filteredMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeMembers = mockTeamMembers.filter((m) => m.status === "active").length
  const pendingInvites = mockTeamMembers.filter((m) => m.status === "pending").length

  const handleInvite = () => {
    setIsInviteDialogOpen(false)
    setInviteEmail("")
    setInviteRole("advisor")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and their permissions.
          </p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="advisor">Adviser</SelectItem>
                    <SelectItem value="support">Support Staff</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {roleDescriptions[inviteRole]}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
                <Mail className="size-4" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTeamMembers.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                <div className="size-3 rounded-full bg-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeMembers}</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-yellow-100">
                <Mail className="size-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingInvites}</p>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Team Members</CardTitle>
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="size-4" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredMembers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {member.avatar && <AvatarImage src={member.avatar} />}
                          <AvatarFallback size="sm">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          member.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : member.role === "advisor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {roleLabels[member.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {member.status === "active" ? "Active" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.lastActive}
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
                            <UserCog className="size-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          {member.status === "pending" && (
                            <DropdownMenuItem>
                              <Mail className="size-4 mr-2" />
                              Resend Invitation
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <UserMinus className="size-4 mr-2" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={<Search />}
              title="No members found"
              description="Try adjusting your search query"
              className="py-12"
            />
          )}
        </CardContent>
      </Card>

      {/* Roles Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Role Permissions</CardTitle>
          <CardDescription>
            Understanding what each role can access
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {Object.entries(roleLabels).map(([key, label]) => (
              <div
                key={key}
                className="flex flex-col gap-2 rounded-lg border p-4"
              >
                <Badge
                  className={cn(
                    "w-fit",
                    key === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : key === "advisor"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {label}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {roleDescriptions[key]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
