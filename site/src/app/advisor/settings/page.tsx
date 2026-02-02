"use client"

import * as React from "react"
import {
  Bell,
  Lock,
  Mail,
  Shield,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock settings data
const mockSettings = {
  notifications: {
    emailNewLeads: true,
    emailMessages: true,
    emailBookings: true,
    emailMarketing: false,
    pushNewLeads: true,
    pushMessages: true,
    pushBookings: false,
  },
  privacy: {
    showEmail: true,
    showPhone: true,
    showLocation: true,
    profileVisibility: "public",
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: "3 months ago",
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = React.useState(mockSettings)
  const [isSaving, setIsSaving] = React.useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false)
  const [passwordForm, setPasswordForm] = React.useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handlePasswordChange = () => {
    setIsPasswordDialogOpen(false)
    setPasswordForm({ current: "", new: "", confirm: "" })
  }

  const updateNotification = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  const updatePrivacy = (key: keyof typeof settings.privacy, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security.
          </p>
        </div>
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how and when you want to be notified
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Email Notifications */}
            <div>
              <h4 className="text-base font-medium mb-4 flex items-center gap-2">
                <Mail className="size-4" />
                Email Notifications
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive a new lead enquiry
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNewLeads}
                    onCheckedChange={(v) => updateNotification("emailNewLeads", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email when clients send you messages
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailMessages}
                    onCheckedChange={(v) => updateNotification("emailMessages", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about upcoming appointments
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailBookings}
                    onCheckedChange={(v) => updateNotification("emailBookings", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing & Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      News, product updates, and tips
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailMarketing}
                    onCheckedChange={(v) => updateNotification("emailMarketing", v)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Push Notifications */}
            <div>
              <h4 className="text-base font-medium mb-4 flex items-center gap-2">
                <Smartphone className="size-4" />
                Push Notifications
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Instant push notification for new leads
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNewLeads}
                    onCheckedChange={(v) => updateNotification("pushNewLeads", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Push notification for new messages
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushMessages}
                    onCheckedChange={(v) => updateNotification("pushMessages", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Booking Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Push notification 15 minutes before appointments
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushBookings}
                    onCheckedChange={(v) => updateNotification("pushBookings", v)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>
              Control what information is visible on your public profile
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Email Address</Label>
                <p className="text-sm text-muted-foreground">
                  Display your email on your public profile
                </p>
              </div>
              <Switch
                checked={settings.privacy.showEmail}
                onCheckedChange={(v) => updatePrivacy("showEmail", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Phone Number</Label>
                <p className="text-sm text-muted-foreground">
                  Display your phone on your public profile
                </p>
              </div>
              <Switch
                checked={settings.privacy.showPhone}
                onCheckedChange={(v) => updatePrivacy("showPhone", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Location</Label>
                <p className="text-sm text-muted-foreground">
                  Display your city/region on your public profile
                </p>
              </div>
              <Switch
                checked={settings.privacy.showLocation}
                onCheckedChange={(v) => updatePrivacy("showLocation", v)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <Select
                value={settings.privacy.profileVisibility}
                onValueChange={(v) => updatePrivacy("profileVisibility", v)}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Visible to everyone</SelectItem>
                  <SelectItem value="clients">Clients Only - Visible to your clients</SelectItem>
                  <SelectItem value="hidden">Hidden - Not visible in search</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your password and account security
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Password */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Password</Label>
                <p className="text-sm text-muted-foreground">
                  Last changed {settings.security.lastPasswordChange}
                </p>
              </div>
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Lock className="size-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.current}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              current: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.new}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              new: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirm: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsPasswordDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePasswordChange}
                      disabled={
                        !passwordForm.current ||
                        !passwordForm.new ||
                        passwordForm.new !== passwordForm.confirm
                      }
                    >
                      Update Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={settings.security.twoFactorEnabled}
                onCheckedChange={(v) =>
                  setSettings((prev) => ({
                    ...prev,
                    security: { ...prev.security, twoFactorEnabled: v },
                  }))
                }
              />
            </div>

            <Separator />

            {/* Active Sessions */}
            <div className="space-y-2">
              <Label>Active Sessions</Label>
              <p className="text-sm text-muted-foreground">
                You&apos;re currently logged in on 2 devices
              </p>
              <Button variant="outline" size="sm">
                <LogOut className="size-4" />
                Sign out all other sessions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="size-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
