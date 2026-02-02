"use client"

import * as React from "react"
import {
  Save,
  Upload,
  Camera,
  Plus,
  X,
  GraduationCap,
  Award,
  MapPin,
  Globe,
  Linkedin,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock profile data
const mockProfile = {
  firstName: "John",
  lastName: "Anderson",
  title: "Senior Financial Adviser",
  company: "Anderson Financial Services",
  email: "john.anderson@example.com",
  phone: "+61 412 345 678",
  location: "Sydney, NSW",
  website: "www.andersonfinancial.com.au",
  linkedin: "linkedin.com/in/johnanderson",
  bio: "With over 15 years of experience in financial planning, I help Australians achieve their retirement goals and build lasting wealth. I specialize in retirement planning, superannuation strategies, and investment management.",
  afsLicense: "123456",
  qualifications: [
    "Certified Financial Planner (CFP)",
    "Master of Financial Planning - Griffith University",
    "Bachelor of Commerce - University of Sydney",
  ],
  specializations: [
    "Retirement Planning",
    "Superannuation",
    "Investment Strategy",
    "Estate Planning",
    "Insurance",
  ],
  languages: ["English", "Mandarin"],
  yearsExperience: 15,
  acceptingNewClients: true,
  minimumInvestment: "$100,000",
  feeStructure: "Fee for Service",
}

const allSpecializations = [
  "Retirement Planning",
  "Superannuation",
  "Investment Strategy",
  "Estate Planning",
  "Insurance",
  "Tax Planning",
  "Debt Management",
  "Centrelink & Aged Care",
  "Self Managed Super Funds",
  "Wealth Accumulation",
]

export default function ProfilePage() {
  const [profile, setProfile] = React.useState(mockProfile)
  const [newQualification, setNewQualification] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Show success message
  }

  const addQualification = () => {
    if (newQualification.trim()) {
      setProfile((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()],
      }))
      setNewQualification("")
    }
  }

  const removeQualification = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }))
  }

  const toggleSpecialization = (spec: string) => {
    setProfile((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your public profile and credentials.
          </p>
        </div>
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
              <CardDescription>
                Your public profile information visible to potential clients
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar size="xl">
                  <AvatarFallback size="xl">
                    {getInitials(`${profile.firstName} ${profile.lastName}`)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="size-4" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Title & Company */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Practice Name</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, company: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  maxLength={500}
                  showCount
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, location: e.target.value }))
                    }
                    leftIcon={<MapPin className="size-4" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, website: e.target.value }))
                    }
                    leftIcon={<Globe className="size-4" />}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={profile.linkedin}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, linkedin: e.target.value }))
                  }
                  leftIcon={<Linkedin className="size-4" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="size-5" />
                Qualifications & Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="afsLicense">AFSL/AR Number</Label>
                <Input
                  id="afsLicense"
                  value={profile.afsLicense}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, afsLicense: e.target.value }))
                  }
                  placeholder="e.g., 123456"
                />
              </div>

              <div className="space-y-2">
                <Label>Qualifications</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.qualifications.map((qual, index) => (
                    <Badge
                      key={index}
                      className="gap-1 bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {qual}
                      <button
                        onClick={() => removeQualification(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a qualification..."
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addQualification()
                      }
                    }}
                  />
                  <Button variant="outline" onClick={addQualification}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select
                  value={profile.yearsExperience.toString()}
                  onValueChange={(v) =>
                    setProfile((prev) => ({
                      ...prev,
                      yearsExperience: parseInt(v),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(30)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} {i === 0 ? "year" : "years"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Specializations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Award className="size-5" />
                Specializations
              </CardTitle>
              <CardDescription>
                Select the areas you specialize in (shown to clients searching for advisers)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {allSpecializations.map((spec) => (
                  <Badge
                    key={spec}
                    className={cn(
                      "cursor-pointer transition-colors",
                      profile.specializations.includes(spec)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                    onClick={() => toggleSpecialization(spec)}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Availability</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accepting New Clients</Label>
                  <p className="text-sm text-muted-foreground">
                    Show as available for new enquiries
                  </p>
                </div>
                <Switch
                  checked={profile.acceptingNewClients}
                  onCheckedChange={(checked) =>
                    setProfile((prev) => ({
                      ...prev,
                      acceptingNewClients: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Service Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minInvestment">Minimum Investment</Label>
                <Select
                  value={profile.minimumInvestment}
                  onValueChange={(v) =>
                    setProfile((prev) => ({ ...prev, minimumInvestment: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No minimum">No minimum</SelectItem>
                    <SelectItem value="$50,000">$50,000</SelectItem>
                    <SelectItem value="$100,000">$100,000</SelectItem>
                    <SelectItem value="$250,000">$250,000</SelectItem>
                    <SelectItem value="$500,000">$500,000</SelectItem>
                    <SelectItem value="$1,000,000">$1,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feeStructure">Fee Structure</Label>
                <Select
                  value={profile.feeStructure}
                  onValueChange={(v) =>
                    setProfile((prev) => ({ ...prev, feeStructure: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fee for Service">Fee for Service</SelectItem>
                    <SelectItem value="Percentage of FUM">Percentage of FUM</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Commission-based">Commission-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Languages</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <Badge key={lang} className="bg-muted text-muted-foreground">
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
