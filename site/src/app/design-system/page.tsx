"use client";

import { useState } from "react";
import {
  Mail,
  Search,
  Eye,
  EyeOff,
  User,
  Settings,
  Bell,
  Users,
  TrendingUp,
  FileText,
  FolderOpen,
  Plus,
  Clock,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  getInitials,
} from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
} from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

// Navigation structure matching BUILD_PLAN
const sections = [
  {
    id: "tokens",
    title: "Tokens",
    items: [
      { id: "0.1", name: "Colors", ready: true },
      { id: "0.2", name: "Typography", ready: true },
      { id: "0.3", name: "Spacing", ready: true },
      { id: "0.4", name: "Borders & Shadows", ready: true },
    ],
  },
  {
    id: "core-inputs",
    title: "Core Inputs",
    items: [
      { id: "0.5", name: "Button", ready: true },
      { id: "0.6", name: "Input field", ready: true },
      { id: "0.7", name: "Textarea", ready: true },
      { id: "0.8", name: "Select dropdown", ready: true },
      { id: "0.9", name: "Checkbox", ready: true },
      { id: "0.10", name: "Radio buttons", ready: true },
      { id: "0.11", name: "Toggle switch", ready: true },
      { id: "0.12", name: "File upload", ready: true },
    ],
  },
  {
    id: "display",
    title: "Display",
    items: [
      { id: "0.13", name: "Badge", ready: true },
      { id: "0.14", name: "Avatar", ready: true },
      { id: "0.15", name: "Card", ready: true },
      { id: "0.16", name: "Stat card", ready: true },
      { id: "0.17", name: "Empty state", ready: true },
      { id: "0.18", name: "Loading skeleton", ready: true },
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    items: [
      { id: "0.19", name: "Sidebar", ready: false },
      { id: "0.20", name: "Topbar", ready: false },
      { id: "0.21", name: "Breadcrumb", ready: false },
      { id: "0.22", name: "Tabs", ready: false },
      { id: "0.23", name: "Pagination", ready: false },
      { id: "0.24", name: "Dropdown menu", ready: false },
      { id: "0.25", name: "Context menu", ready: false },
      { id: "0.26", name: "Command palette", ready: false },
      { id: "0.27", name: "Navigation menu", ready: false },
    ],
  },
  {
    id: "composite",
    title: "Composite",
    items: [
      { id: "0.28", name: "Data table", ready: false },
      { id: "0.29", name: "Form layout", ready: false },
      { id: "0.30", name: "Modal / Dialog", ready: false },
      { id: "0.31", name: "Sheet / Drawer", ready: false },
      { id: "0.32", name: "Accordion", ready: false },
      { id: "0.33", name: "Calendar", ready: false },
      { id: "0.34", name: "Combobox", ready: false },
    ],
  },
  {
    id: "feedback",
    title: "Feedback",
    items: [
      { id: "0.35", name: "Toast / Sonner", ready: false },
      { id: "0.36", name: "Alert", ready: false },
      { id: "0.37", name: "Progress", ready: false },
    ],
  },
];

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState("0.1");
  const [showPassword, setShowPassword] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sticky Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold text-foreground">Design System</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Phase 0 Components
          </p>
        </div>
        <nav className="px-4 pb-6">
          {sections.map((section) => (
            <div key={section.id} className="mb-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      } ${!item.ready ? "opacity-50" : ""}`}
                    >
                      <span className="text-xs text-muted-foreground mr-2">
                        {item.id}
                      </span>
                      {item.name}
                      {!item.ready && (
                        <span className="ml-2 text-xs">(soon)</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* PHASE 0: DESIGN SYSTEM */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Phase 0: Design System
            </h1>
            <p className="text-muted-foreground">
              Core design tokens and components for building the Advyser
              platform.
            </p>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* TOKENS */}
          {/* ────────────────────────────────────────────────────────── */}

          {/* 0.1 Colors */}
          <Section id="0.1" title="Colors">
            <p className="text-sm text-muted-foreground mb-6">
              Neutral gray primary palette for a sophisticated, professional
              financial advisory look. Inspired by Basel Supercluster.
            </p>

            <div className="space-y-8">
              {/* Primary Colors */}
              <div>
                <h4 className="text-sm font-medium mb-3">Primary (Neutral)</h4>
                <div className="flex flex-wrap gap-3">
                  <ColorSwatch color="bg-primary" name="Primary" hex="#0A0A0A" />
                  <ColorSwatch
                    color="bg-gray-800"
                    name="Hover"
                    hex="#262626"
                  />
                  <ColorSwatch
                    color="bg-gray-700"
                    name="Active"
                    hex="#404040"
                  />
                  <ColorSwatch
                    color="bg-primary/50"
                    name="Primary/50"
                    hex="50%"
                  />
                  <ColorSwatch
                    color="bg-primary/20"
                    name="Primary/20"
                    hex="20%"
                  />
                  <ColorSwatch
                    color="bg-primary/10"
                    name="Primary/10"
                    hex="10%"
                  />
                </div>
              </div>

              {/* Neutral Colors */}
              <div>
                <h4 className="text-sm font-medium mb-3">Neutral (Gray Scale)</h4>
                <div className="flex flex-wrap gap-3">
                  <ColorSwatch
                    color="bg-foreground"
                    name="Foreground"
                    hex="#171717"
                  />
                  <ColorSwatch
                    color="bg-muted-foreground"
                    name="Muted FG"
                    hex="#737373"
                  />
                  <ColorSwatch color="bg-muted" name="Muted" hex="#F5F5F5" />
                  <ColorSwatch color="bg-border" name="Border" hex="#E5E5E5" />
                  <ColorSwatch
                    color="bg-background"
                    name="Background"
                    hex="#FFFFFF"
                    border
                  />
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h4 className="text-sm font-medium mb-3">Semantic</h4>
                <div className="flex flex-wrap gap-3">
                  <ColorSwatch
                    color="bg-destructive"
                    name="Destructive"
                    hex="#EF4444"
                  />
                  <ColorSwatch
                    color="bg-green-600"
                    name="Success"
                    hex="#16A34A"
                  />
                  <ColorSwatch
                    color="bg-yellow-500"
                    name="Warning"
                    hex="#EAB308"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* 0.2 Typography */}
          <Section id="0.2" title="Typography">
            <p className="text-sm text-muted-foreground mb-6">
              DM Sans font family across all sizes and weights for clean,
              professional text.
            </p>

            <div className="space-y-6">
              {/* Headings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Headings
                </h4>
                <div className="space-y-3 p-4 bg-muted/30 rounded-md">
                  <div className="text-4xl font-bold">Heading 1 (36px Bold)</div>
                  <div className="text-3xl font-bold">Heading 2 (30px Bold)</div>
                  <div className="text-2xl font-semibold">
                    Heading 3 (24px Semibold)
                  </div>
                  <div className="text-xl font-semibold">
                    Heading 4 (20px Semibold)
                  </div>
                  <div className="text-lg font-medium">
                    Heading 5 (18px Medium)
                  </div>
                  <div className="text-base font-medium">
                    Heading 6 (16px Medium)
                  </div>
                </div>
              </div>

              {/* Body Text */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Body Text
                </h4>
                <div className="space-y-3 p-4 bg-muted/30 rounded-md">
                  <p className="text-base">
                    Body Default (16px) - The quick brown fox jumps over the lazy
                    dog.
                  </p>
                  <p className="text-sm">
                    Body Small (14px) - The quick brown fox jumps over the lazy
                    dog.
                  </p>
                  <p className="text-xs">
                    Body XS (12px) - The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              </div>

              {/* Font Weights */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Font Weights
                </h4>
                <div className="space-y-2 p-4 bg-muted/30 rounded-md">
                  <p className="font-normal">Regular (400) - Normal text</p>
                  <p className="font-medium">Medium (500) - Labels and buttons</p>
                  <p className="font-semibold">
                    Semibold (600) - Subheadings and emphasis
                  </p>
                  <p className="font-bold">Bold (700) - Headings and titles</p>
                </div>
              </div>
            </div>
          </Section>

          {/* 0.3 Spacing */}
          <Section id="0.3" title="Spacing">
            <p className="text-sm text-muted-foreground mb-6">
              Consistent spacing scale based on 4px base unit.
            </p>

            <div className="space-y-4">
              {[
                { name: "4px", value: "1", px: 4 },
                { name: "8px", value: "2", px: 8 },
                { name: "12px", value: "3", px: 12 },
                { name: "16px", value: "4", px: 16 },
                { name: "24px", value: "6", px: 24 },
                { name: "32px", value: "8", px: 32 },
                { name: "48px", value: "12", px: 48 },
              ].map((space) => (
                <div key={space.name} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-16">
                    {space.name}
                  </span>
                  <div
                    className="bg-primary h-6 rounded-sm"
                    style={{ width: space.px * 3 }}
                  />
                  <span className="text-xs text-muted-foreground">
                    space-{space.value}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* 0.4 Borders & Shadows */}
          <Section id="0.4" title="Borders & Shadows">
            <p className="text-sm text-muted-foreground mb-6">
              6px border radius (rounded-md) with shadow-md for card elevation.
            </p>

            <div className="grid grid-cols-2 gap-8">
              {/* Border Radius */}
              <div>
                <h4 className="text-sm font-medium mb-4">Border Radius</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-primary rounded-none" />
                    <span className="text-sm">rounded-none (0px)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-primary rounded-sm" />
                    <span className="text-sm">rounded-sm (2px)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-primary rounded-md" />
                    <span className="text-sm font-medium text-primary">
                      rounded-md (6px) - Default
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-primary rounded-lg" />
                    <span className="text-sm">rounded-lg (8px)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-primary rounded-full" />
                    <span className="text-sm">rounded-full</span>
                  </div>
                </div>
              </div>

              {/* Shadows */}
              <div>
                <h4 className="text-sm font-medium mb-4">Shadows</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-card border rounded-md shadow-none" />
                    <span className="text-sm">shadow-none</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-card border rounded-md shadow-sm" />
                    <span className="text-sm">shadow-sm</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-card border rounded-md shadow-md" />
                    <span className="text-sm font-medium text-primary">
                      shadow-md - Default
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-card border rounded-md shadow-lg" />
                    <span className="text-sm">shadow-lg</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-card border rounded-md shadow-xl" />
                    <span className="text-sm">shadow-xl</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CORE INPUTS */}
          {/* ────────────────────────────────────────────────────────── */}

          {/* 0.5 Button */}
          <Section id="0.5" title="Button">
            <p className="text-sm text-muted-foreground mb-6">
              All button variants with loading states. Primary action uses solid
              neutral gray.
            </p>

            <div className="space-y-8">
              {/* Variants */}
              <div>
                <h4 className="text-sm font-medium mb-4">Variants</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-medium mb-4">Sizes</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="xs">XS Button</Button>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">XL Button</Button>
                </div>
              </div>

              {/* Icon Buttons */}
              <div>
                <h4 className="text-sm font-medium mb-4">Icon Buttons</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="icon-xs">
                    <Plus />
                  </Button>
                  <Button size="icon-sm">
                    <Plus />
                  </Button>
                  <Button size="icon">
                    <Plus />
                  </Button>
                  <Button size="icon-lg">
                    <Plus />
                  </Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h4 className="text-sm font-medium mb-4">With Icons</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button>
                    <Mail className="size-4" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    <Settings className="size-4" />
                    Settings
                  </Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h4 className="text-sm font-medium mb-4">States</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button loading>Loading...</Button>
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" loading>
                    Processing
                  </Button>
                </div>
              </div>
            </div>
          </Section>

          {/* 0.6 Input */}
          <Section id="0.6" title="Input field">
            <p className="text-sm text-muted-foreground mb-6">
              Bordered dark style with icon support and error states.
            </p>

            <div className="space-y-6 max-w-md">
              {/* Basic */}
              <div className="space-y-2">
                <Label>Default Input</Label>
                <Input placeholder="Enter your name" />
              </div>

              {/* With Icons */}
              <div className="space-y-2">
                <Label>With Left Icon</Label>
                <Input
                  placeholder="Search..."
                  leftIcon={<Search className="size-4" />}
                />
              </div>

              <div className="space-y-2">
                <Label>With Right Icon</Label>
                <Input
                  placeholder="Email address"
                  rightIcon={<Mail className="size-4" />}
                />
              </div>

              {/* Password Toggle */}
              <div className="space-y-2">
                <Label>Password with Toggle</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    }
                  />
                </div>
              </div>

              {/* Error State */}
              <div className="space-y-2">
                <Label>Error State</Label>
                <Input
                  placeholder="Invalid input"
                  error
                  defaultValue="invalid@"
                />
                <p className="text-sm text-destructive">
                  Please enter a valid email address.
                </p>
              </div>

              {/* Disabled */}
              <div className="space-y-2">
                <Label>Disabled</Label>
                <Input placeholder="Disabled input" disabled />
              </div>
            </div>
          </Section>

          {/* 0.7 Textarea */}
          <Section id="0.7" title="Textarea">
            <p className="text-sm text-muted-foreground mb-6">
              Multi-line text input with optional character count.
            </p>

            <div className="space-y-6 max-w-md">
              {/* Basic */}
              <div className="space-y-2">
                <Label>Default</Label>
                <Textarea placeholder="Enter your message..." />
              </div>

              {/* With Character Count */}
              <div className="space-y-2">
                <Label>With Character Count</Label>
                <Textarea
                  placeholder="Type your bio..."
                  maxLength={200}
                  showCount
                />
              </div>

              {/* Error State */}
              <div className="space-y-2">
                <Label>Error State</Label>
                <Textarea placeholder="Required field" error />
                <p className="text-sm text-destructive">This field is required.</p>
              </div>

              {/* Disabled */}
              <div className="space-y-2">
                <Label>Disabled</Label>
                <Textarea placeholder="Disabled textarea" disabled />
              </div>
            </div>
          </Section>

          {/* 0.8 Select */}
          <Section id="0.8" title="Select dropdown">
            <p className="text-sm text-muted-foreground mb-6">
              Dropdown select with group support and states.
            </p>

            <div className="space-y-6 max-w-md">
              {/* Basic */}
              <div className="space-y-2">
                <Label>Basic Select</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* With Groups */}
              <div className="space-y-2">
                <Label>With Groups</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Advisory Services</SelectLabel>
                      <SelectItem value="financial">Financial Planning</SelectItem>
                      <SelectItem value="retirement">
                        Retirement Planning
                      </SelectItem>
                      <SelectItem value="investment">
                        Investment Management
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Tax Services</SelectLabel>
                      <SelectItem value="tax-planning">Tax Planning</SelectItem>
                      <SelectItem value="tax-prep">Tax Preparation</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Error State */}
              <div className="space-y-2">
                <Label>Error State</Label>
                <Select>
                  <SelectTrigger error>
                    <SelectValue placeholder="Select required" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-destructive">
                  Please select an option.
                </p>
              </div>

              {/* Disabled */}
              <div className="space-y-2">
                <Label>Disabled</Label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Disabled select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          {/* 0.9 Checkbox */}
          <Section id="0.9" title="Checkbox">
            <p className="text-sm text-muted-foreground mb-6">
              Single and multiple selection with neutral check indicator.
            </p>

            <div className="space-y-6">
              {/* Single */}
              <div>
                <h4 className="text-sm font-medium mb-4">Single Checkbox</h4>
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" defaultChecked />
                  <Label htmlFor="terms" className="cursor-pointer">
                    I agree to the terms and conditions
                  </Label>
                </div>
              </div>

              {/* Multiple */}
              <div>
                <h4 className="text-sm font-medium mb-4">Multiple Selection</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="email-updates" defaultChecked />
                    <Label htmlFor="email-updates" className="cursor-pointer">
                      Email updates
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="sms-notifications" />
                    <Label htmlFor="sms-notifications" className="cursor-pointer">
                      SMS notifications
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="push-notifications" defaultChecked />
                    <Label htmlFor="push-notifications" className="cursor-pointer">
                      Push notifications
                    </Label>
                  </div>
                </div>
              </div>

              {/* States */}
              <div>
                <h4 className="text-sm font-medium mb-4">States</h4>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Checkbox id="unchecked" />
                    <Label htmlFor="unchecked">Unchecked</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="checked" defaultChecked />
                    <Label htmlFor="checked">Checked</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="disabled" disabled />
                    <Label htmlFor="disabled">Disabled</Label>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 0.10 Radio */}
          <Section id="0.10" title="Radio buttons">
            <p className="text-sm text-muted-foreground mb-6">
              Radio groups with vertical and horizontal layouts.
            </p>

            <div className="space-y-8">
              {/* Vertical */}
              <div>
                <h4 className="text-sm font-medium mb-4">Vertical Group</h4>
                <RadioGroup defaultValue="option1">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="option1" id="r1" />
                    <Label htmlFor="r1" className="cursor-pointer">
                      Standard Plan
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="option2" id="r2" />
                    <Label htmlFor="r2" className="cursor-pointer">
                      Professional Plan
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="option3" id="r3" />
                    <Label htmlFor="r3" className="cursor-pointer">
                      Enterprise Plan
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Horizontal */}
              <div>
                <h4 className="text-sm font-medium mb-4">Horizontal Group</h4>
                <RadioGroup defaultValue="monthly" className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">
                      Monthly
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <Label htmlFor="quarterly" className="cursor-pointer">
                      Quarterly
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="cursor-pointer">
                      Yearly
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* States */}
              <div>
                <h4 className="text-sm font-medium mb-4">States</h4>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <RadioGroup>
                      <RadioGroupItem value="unselected" id="unselected" />
                    </RadioGroup>
                    <Label htmlFor="unselected">Unselected</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroup defaultValue="selected">
                      <RadioGroupItem value="selected" id="selected" />
                    </RadioGroup>
                    <Label htmlFor="selected">Selected</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroup>
                      <RadioGroupItem value="disabled" id="radio-disabled" disabled />
                    </RadioGroup>
                    <Label htmlFor="radio-disabled">Disabled</Label>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 0.11 Toggle Switch */}
          <Section id="0.11" title="Toggle switch">
            <p className="text-sm text-muted-foreground mb-6">
              On/off toggle with neutral active state.
            </p>

            <div className="space-y-8">
              {/* Basic */}
              <div>
                <h4 className="text-sm font-medium mb-4">Basic Toggle</h4>
                <div className="flex items-center gap-4">
                  <Switch id="airplane" />
                  <Label htmlFor="airplane" className="cursor-pointer">
                    Airplane Mode
                  </Label>
                </div>
              </div>

              {/* Settings Example */}
              <div>
                <h4 className="text-sm font-medium mb-4">Settings Example</h4>
                <div className="space-y-4 max-w-md">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email about account activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get push notifications on your device
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* States */}
              <div>
                <h4 className="text-sm font-medium mb-4">States</h4>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch />
                    <span className="text-sm">Off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm">On</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch disabled />
                    <span className="text-sm">Disabled</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 0.12 File Upload */}
          <Section id="0.12" title="File upload">
            <p className="text-sm text-muted-foreground mb-6">
              Drag and drop file upload with format restrictions.
            </p>

            <div className="space-y-8">
              {/* Basic */}
              <div>
                <h4 className="text-sm font-medium mb-4">Basic Upload</h4>
                <div className="max-w-md">
                  <FileUpload placeholder="Drag and drop files here, or click to browse" />
                </div>
              </div>

              {/* Image Only */}
              <div>
                <h4 className="text-sm font-medium mb-4">Image Only</h4>
                <div className="max-w-md">
                  <FileUpload
                    accept="image/*"
                    placeholder="Drag and drop images here"
                  />
                </div>
              </div>

              {/* Multiple Files */}
              <div>
                <h4 className="text-sm font-medium mb-4">Multiple Files</h4>
                <div className="max-w-md">
                  <FileUpload
                    multiple
                    accept=".pdf,.doc,.docx"
                    placeholder="Upload multiple documents"
                    maxSize={5}
                  />
                </div>
              </div>

              {/* Disabled */}
              <div>
                <h4 className="text-sm font-medium mb-4">Disabled</h4>
                <div className="max-w-md">
                  <FileUpload disabled placeholder="Upload disabled" />
                </div>
              </div>
            </div>
          </Section>

          {/* ────────────────────────────────────────────────────────── */}
          {/* DISPLAY */}
          {/* ────────────────────────────────────────────────────────── */}

          {/* 0.13 Badge */}
          <Section id="0.13" title="Badge">
            <p className="text-sm text-muted-foreground mb-6">
              Status and role badges for visual categorization.
            </p>

            <div className="space-y-8">
              {/* Status Badges */}
              <div>
                <h4 className="text-sm font-medium mb-4">Status Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge status="pending">Pending</Badge>
                  <Badge status="active">Active</Badge>
                  <Badge status="verified">Verified</Badge>
                  <Badge status="inactive">Inactive</Badge>
                </div>
              </div>

              {/* Role Badges */}
              <div>
                <h4 className="text-sm font-medium mb-4">Role Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge userRole="admin">Admin</Badge>
                  <Badge userRole="advisor">Advisor</Badge>
                  <Badge userRole="consumer">Consumer</Badge>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-medium mb-4">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge status="active" size="sm">
                    Small
                  </Badge>
                  <Badge status="active" size="default">
                    Default
                  </Badge>
                </div>
              </div>
            </div>
          </Section>

          {/* 0.14 Avatar */}
          <Section id="0.14" title="Avatar">
            <p className="text-sm text-muted-foreground mb-6">
              User avatars in multiple sizes with fallback initials.
            </p>

            <div className="space-y-8">
              {/* Sizes */}
              <div>
                <h4 className="text-sm font-medium mb-4">Sizes</h4>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <Avatar size="xs">
                      <AvatarFallback size="xs">
                        {getInitials("John Doe")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-2">xs (24px)</p>
                  </div>
                  <div className="text-center">
                    <Avatar size="sm">
                      <AvatarFallback size="sm">
                        {getInitials("Jane Smith")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-2">sm (32px)</p>
                  </div>
                  <div className="text-center">
                    <Avatar size="default">
                      <AvatarFallback size="default">
                        {getInitials("Bob Wilson")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-2">
                      default (40px)
                    </p>
                  </div>
                  <div className="text-center">
                    <Avatar size="lg">
                      <AvatarFallback size="lg">
                        {getInitials("Alice Brown")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-2">lg (56px)</p>
                  </div>
                  <div className="text-center">
                    <Avatar size="xl">
                      <AvatarFallback size="xl">
                        {getInitials("Charlie Davis")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-2">xl (80px)</p>
                  </div>
                </div>
              </div>

              {/* With Image */}
              <div>
                <h4 className="text-sm font-medium mb-4">With Image</h4>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    Falls back to initials when image fails
                  </span>
                </div>
              </div>

              {/* Initials */}
              <div>
                <h4 className="text-sm font-medium mb-4">Initials Examples</h4>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{getInitials("John")}</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>{getInitials("Jane Doe")}</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>
                      {getInitials("Alice Bob Carter")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </Section>

          {/* 0.15 Card */}
          <Section id="0.15" title="Card">
            <p className="text-sm text-muted-foreground mb-6">
              Basic card with header, content, and footer sections.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>
                    A simple card with title and description
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is the card content area. You can put any content here
                    including text, forms, or other components.
                  </p>
                </CardContent>
              </Card>

              {/* Card with Footer */}
              <Card>
                <CardHeader>
                  <CardTitle>With Footer</CardTitle>
                  <CardDescription>Card with action buttons</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cards can include a footer section for actions.
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Save</Button>
                </CardFooter>
              </Card>
            </div>
          </Section>

          {/* 0.16 Stat Card */}
          <Section id="0.16" title="Stat card">
            <p className="text-sm text-muted-foreground mb-6">
              Statistics display with value, change indicator, and optional icon.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total Clients"
                value="2,847"
                change={{ value: 12, type: "increase" }}
                icon={<Users className="size-6" />}
              />
              <StatCard
                label="Revenue"
                value="$45,231"
                change={{ value: 8.2, type: "increase" }}
                icon={<TrendingUp className="size-6" />}
              />
              <StatCard
                label="Pending Reviews"
                value="23"
                change={{ value: 3, type: "decrease" }}
                icon={<Clock className="size-6" />}
              />
            </div>
          </Section>

          {/* 0.17 Empty State */}
          <Section id="0.17" title="Empty state">
            <p className="text-sm text-muted-foreground mb-6">
              Placeholder for empty content areas with optional action.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <EmptyState
                  icon={<FolderOpen />}
                  title="No documents yet"
                  description="Upload your first document to get started with your advisory services."
                  action={{
                    label: "Upload Document",
                    onClick: () => {},
                  }}
                />
              </Card>

              <Card>
                <EmptyState
                  icon={<FileText />}
                  title="No reports available"
                  description="Reports will appear here once you have client data."
                />
              </Card>
            </div>
          </Section>

          {/* 0.18 Loading Skeleton */}
          <Section id="0.18" title="Loading skeleton">
            <p className="text-sm text-muted-foreground mb-6">
              Animated loading placeholders for content.
            </p>

            <div className="space-y-8">
              {/* Text Skeleton */}
              <div>
                <h4 className="text-sm font-medium mb-4">Text Skeleton</h4>
                <div className="max-w-md space-y-4">
                  <SkeletonText />
                  <SkeletonText lines={3} />
                </div>
              </div>

              {/* Avatar Skeleton */}
              <div>
                <h4 className="text-sm font-medium mb-4">Avatar Skeleton</h4>
                <div className="flex items-center gap-4">
                  <SkeletonAvatar size="sm" />
                  <SkeletonAvatar size="default" />
                  <SkeletonAvatar size="lg" />
                </div>
              </div>

              {/* Card Skeleton */}
              <div>
                <h4 className="text-sm font-medium mb-4">Card Skeleton</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SkeletonCard />
                  <SkeletonCard showAvatar showFooter />
                </div>
              </div>

              {/* Custom Skeleton */}
              <div>
                <h4 className="text-sm font-medium mb-4">Custom Skeleton</h4>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ────────────────────────────────────────────────────────── */}
          {/* NAVIGATION (Placeholder) */}
          {/* ────────────────────────────────────────────────────────── */}

          {sections
            .find((s) => s.id === "navigation")
            ?.items.map((item) => (
              <PlaceholderSection key={item.id} id={item.id} title={item.name} />
            ))}

          {/* ────────────────────────────────────────────────────────── */}
          {/* COMPOSITE (Placeholder) */}
          {/* ────────────────────────────────────────────────────────── */}

          {sections
            .find((s) => s.id === "composite")
            ?.items.map((item) => (
              <PlaceholderSection key={item.id} id={item.id} title={item.name} />
            ))}

          {/* ────────────────────────────────────────────────────────── */}
          {/* FEEDBACK (Placeholder) */}
          {/* ────────────────────────────────────────────────────────── */}

          {sections
            .find((s) => s.id === "feedback")
            ?.items.map((item) => (
              <PlaceholderSection key={item.id} id={item.id} title={item.name} />
            ))}
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Helper Components */
/* ─────────────────────────────────────────────────────────────── */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`section-${id}`} className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
          {id}
        </span>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function PlaceholderSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={`section-${id}`} className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
          {id}
        </span>
        <h2 className="text-xl font-semibold text-muted-foreground">{title}</h2>
      </div>
      <Card className="border-dashed bg-muted/20">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Clock className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Coming soon</h3>
          <p className="text-sm text-muted-foreground">
            This component is planned for a future release.
          </p>
        </div>
      </Card>
    </section>
  );
}

function ColorSwatch({
  color,
  name,
  hex,
  border = false,
}: {
  color: string;
  name: string;
  hex: string;
  border?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-12 h-12 rounded-md ${color} ${border ? "border" : ""}`}
      />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{hex}</p>
      </div>
    </div>
  );
}
