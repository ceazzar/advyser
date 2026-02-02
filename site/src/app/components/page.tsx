"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight, Plus, Trash2, Search, Eye, EyeOff, User, Lock } from "lucide-react";
import { useState } from "react";

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Component Library</h1>
        <p className="text-muted-foreground mb-8">Preview of all Advyser components</p>

        {/* Buttons */}
        <Section title="0.5 Button">
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <Label>Variants</Label>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <Label>With Icons</Label>
              <div className="flex flex-wrap gap-3">
                <Button><Mail className="size-4" /> Send Email</Button>
                <Button variant="secondary">Continue <ArrowRight className="size-4" /></Button>
                <Button variant="outline"><Plus className="size-4" /> Add New</Button>
                <Button variant="destructive"><Trash2 className="size-4" /> Delete</Button>
              </div>
            </div>

            {/* Icon Only */}
            <div>
              <Label>Icon Only</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="icon-sm"><Plus className="size-4" /></Button>
                <Button size="icon"><Plus className="size-4" /></Button>
                <Button size="icon-lg"><Plus className="size-5" /></Button>
                <Button size="icon" variant="outline"><Mail className="size-4" /></Button>
                <Button size="icon" variant="ghost"><ArrowRight className="size-4" /></Button>
              </div>
            </div>

            {/* States */}
            <div>
              <Label>States</Label>
              <div className="flex flex-wrap gap-3">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
                <Button loading variant="secondary">Loading</Button>
                <Button loading variant="outline">Loading</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Input */}
        <Section title="0.6 Input">
          <InputExamples />
        </Section>

        {/* Textarea */}
        <Section title="0.7 Textarea">
          <div className="space-y-6">
            {/* Basic */}
            <div>
              <Label>Basic</Label>
              <div className="flex flex-col gap-3 max-w-md">
                <Textarea placeholder="Write your message..." />
              </div>
            </div>

            {/* With Character Count */}
            <div>
              <Label>With Character Count</Label>
              <div className="flex flex-col gap-3 max-w-md">
                <Textarea
                  placeholder="Tell us about yourself..."
                  maxLength={200}
                  showCount
                />
              </div>
            </div>

            {/* States */}
            <div>
              <Label>States</Label>
              <div className="flex flex-col gap-3 max-w-md">
                <Textarea placeholder="Normal" />
                <Textarea placeholder="With value" defaultValue="This is some pre-filled content that the user can edit." />
                <Textarea placeholder="Disabled" disabled />
                <Textarea placeholder="Error state" error />
              </div>
            </div>
          </div>
        </Section>

        {/* Select */}
        <Section title="0.8 Select">
          <div className="space-y-6">
            {/* Basic */}
            <div>
              <Label>Basic</Label>
              <div className="flex flex-col gap-3 max-w-sm">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial Planning</SelectItem>
                    <SelectItem value="tax">Tax Advice</SelectItem>
                    <SelectItem value="property">Property Investment</SelectItem>
                    <SelectItem value="super">Superannuation</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* With Groups */}
            <div>
              <Label>With Groups</Label>
              <div className="flex flex-col gap-3 max-w-sm">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select advisor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Investment</SelectLabel>
                      <SelectItem value="stocks">Stocks & Shares</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Planning</SelectLabel>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="estate">Estate Planning</SelectItem>
                      <SelectItem value="education">Education Funding</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* States */}
            <div>
              <Label>States</Label>
              <div className="flex flex-col gap-3 max-w-sm">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Normal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="selected">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selected">Pre-selected value</SelectItem>
                    <SelectItem value="other">Other option</SelectItem>
                  </SelectContent>
                </Select>

                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Disabled" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger error>
                    <SelectValue placeholder="Error state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Section>

        {/* Checkbox */}
        <Section title="0.9 Checkbox">
          <div className="space-y-6">
            {/* Basic */}
            <div>
              <Label>Basic</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the terms and conditions
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="newsletter" defaultChecked />
                  <label htmlFor="newsletter" className="text-sm cursor-pointer">
                    Subscribe to newsletter
                  </label>
                </div>
              </div>
            </div>

            {/* Multiple Options */}
            <div>
              <Label>Multiple Options</Label>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium mb-1">Select your interests:</p>
                <div className="flex items-center gap-3">
                  <Checkbox id="financial" defaultChecked />
                  <label htmlFor="financial" className="text-sm cursor-pointer">Financial Planning</label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="tax" />
                  <label htmlFor="tax" className="text-sm cursor-pointer">Tax Advice</label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="property" defaultChecked />
                  <label htmlFor="property" className="text-sm cursor-pointer">Property Investment</label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="super" />
                  <label htmlFor="super" className="text-sm cursor-pointer">Superannuation</label>
                </div>
              </div>
            </div>

            {/* States */}
            <div>
              <Label>States</Label>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Unchecked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">Checked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox disabled />
                  <span className="text-sm text-muted-foreground">Disabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox disabled defaultChecked />
                  <span className="text-sm text-muted-foreground">Disabled Checked</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Radio */}
        <Section title="0.10 Radio">
          <div className="space-y-6">
            {/* Basic */}
            <div>
              <Label>Basic</Label>
              <RadioGroup defaultValue="option-1">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option-1" id="r1" />
                  <label htmlFor="r1" className="text-sm cursor-pointer">Option One</label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option-2" id="r2" />
                  <label htmlFor="r2" className="text-sm cursor-pointer">Option Two</label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option-3" id="r3" />
                  <label htmlFor="r3" className="text-sm cursor-pointer">Option Three</label>
                </div>
              </RadioGroup>
            </div>

            {/* Advisor Types */}
            <div>
              <Label>Advisor Type Selection</Label>
              <RadioGroup defaultValue="financial">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="financial" id="type-1" />
                  <label htmlFor="type-1" className="text-sm cursor-pointer">Financial Planner</label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="tax" id="type-2" />
                  <label htmlFor="type-2" className="text-sm cursor-pointer">Tax Accountant</label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="property" id="type-3" />
                  <label htmlFor="type-3" className="text-sm cursor-pointer">Property Advisor</label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="mortgage" id="type-4" />
                  <label htmlFor="type-4" className="text-sm cursor-pointer">Mortgage Broker</label>
                </div>
              </RadioGroup>
            </div>

            {/* Horizontal */}
            <div>
              <Label>Horizontal Layout</Label>
              <RadioGroup defaultValue="yes" className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="h1" />
                  <label htmlFor="h1" className="text-sm cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="h2" />
                  <label htmlFor="h2" className="text-sm cursor-pointer">No</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="maybe" id="h3" />
                  <label htmlFor="h3" className="text-sm cursor-pointer">Maybe</label>
                </div>
              </RadioGroup>
            </div>

            {/* Disabled */}
            <div>
              <Label>Disabled State</Label>
              <RadioGroup defaultValue="disabled-selected" disabled>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="disabled-1" id="d1" />
                  <label htmlFor="d1" className="text-sm text-muted-foreground">Disabled option</label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="disabled-selected" id="d2" />
                  <label htmlFor="d2" className="text-sm text-muted-foreground">Disabled selected</label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Section>

        {/* Toggle Switch */}
        <Section title="0.11 Toggle Switch">
          <div className="space-y-6">
            {/* Basic */}
            <div>
              <Label>Basic</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between max-w-sm">
                  <label htmlFor="notifications" className="text-sm">Enable notifications</label>
                  <Switch id="notifications" />
                </div>
                <div className="flex items-center justify-between max-w-sm">
                  <label htmlFor="marketing" className="text-sm">Marketing emails</label>
                  <Switch id="marketing" defaultChecked />
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <div>
              <Label>Settings Panel Example</Label>
              <div className="bg-card border rounded-lg p-4 max-w-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email Alerts</p>
                    <p className="text-xs text-muted-foreground">Receive email when leads contact you</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">Get text messages for urgent updates</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Profile Visibility</p>
                    <p className="text-xs text-muted-foreground">Show your profile in search results</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            {/* States */}
            <div>
              <Label>States</Label>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Switch />
                  <span className="text-sm">Off</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch defaultChecked />
                  <span className="text-sm">On</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch disabled />
                  <span className="text-sm text-muted-foreground">Disabled</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch disabled defaultChecked />
                  <span className="text-sm text-muted-foreground">Disabled On</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* File Upload */}
        <Section title="0.12 File Upload">
          <div className="space-y-6">
            {/* Basic */}
            <div>
              <Label>Basic</Label>
              <div className="max-w-md">
                <FileUpload />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label>Image Upload Only</Label>
              <div className="max-w-md">
                <FileUpload
                  accept="image/*"
                  placeholder="Drag and drop images here, or click to browse"
                  maxSize={5}
                />
              </div>
            </div>

            {/* Multiple Files */}
            <div>
              <Label>Multiple Files</Label>
              <div className="max-w-md">
                <FileUpload
                  multiple
                  placeholder="Upload multiple documents"
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>

            {/* Disabled */}
            <div>
              <Label>Disabled</Label>
              <div className="max-w-md">
                <FileUpload disabled placeholder="File upload is disabled" />
              </div>
            </div>
          </div>
        </Section>

        {/* Badge */}
        <Section title="0.13 Badge">
          <div className="space-y-6">
            {/* Status Badges */}
            <div>
              <Label>Status Badges</Label>
              <div className="flex flex-wrap gap-3">
                <Badge status="pending">Pending</Badge>
                <Badge status="active">Active</Badge>
                <Badge status="inactive">Inactive</Badge>
                <Badge status="verified">Verified</Badge>
              </div>
            </div>

            {/* Role Badges */}
            <div>
              <Label>Role Badges</Label>
              <div className="flex flex-wrap gap-3">
                <Badge userRole="admin">Admin</Badge>
                <Badge userRole="advisor">Advisor</Badge>
                <Badge userRole="consumer">Consumer</Badge>
              </div>
            </div>

            {/* Size Variants */}
            <div>
              <Label>Size Variants</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Badge status="active" size="sm">Small Active</Badge>
                <Badge status="active" size="default">Default Active</Badge>
                <Badge userRole="advisor" size="sm">Small Advisor</Badge>
                <Badge userRole="advisor" size="default">Default Advisor</Badge>
              </div>
            </div>

            {/* Usage Examples */}
            <div>
              <Label>Usage Examples</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">John Smith</span>
                  <Badge userRole="advisor">Advisor</Badge>
                  <Badge status="verified">Verified</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Jane Doe</span>
                  <Badge userRole="consumer">Consumer</Badge>
                  <Badge status="active">Active</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">System Admin</span>
                  <Badge userRole="admin">Admin</Badge>
                  <Badge status="active">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* More components will be added here */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground text-sm">
            More components coming: Avatar, Card, Stat Card...
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-8 border-b border-border">
      <h2 className="text-lg font-medium mb-6">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mb-3">{children}</p>;
}

function InputExamples() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Basic */}
      <div>
        <Label>Basic</Label>
        <div className="flex flex-col gap-3 max-w-sm">
          <Input placeholder="Enter your email" />
          <Input type="password" placeholder="Enter password" />
          <Input type="number" placeholder="Enter amount" />
        </div>
      </div>

      {/* With Icons */}
      <div>
        <Label>With Icons</Label>
        <div className="flex flex-col gap-3 max-w-sm">
          <Input
            placeholder="Search..."
            leftIcon={<Search className="size-4" />}
          />
          <Input
            placeholder="Username"
            leftIcon={<User className="size-4" />}
          />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            leftIcon={<Lock className="size-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pointer-events-auto cursor-pointer hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />
        </div>
      </div>

      {/* States */}
      <div>
        <Label>States</Label>
        <div className="flex flex-col gap-3 max-w-sm">
          <Input placeholder="Normal" />
          <Input placeholder="With value" defaultValue="john@example.com" />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="Error state" error />
          <Input placeholder="Error with value" error defaultValue="invalid-email" />
        </div>
      </div>
    </div>
  );
}
