"use client"

import * as React from "react"
import {
  CreditCard,
  Download,
  CheckCircle2,
  Calendar,
  FileText,
  Zap,
  Crown,
  Building,
  ArrowRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
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

// Mock billing data
const mockBilling = {
  plan: {
    name: "Professional",
    price: 199,
    interval: "month",
    nextBillingDate: "February 15, 2026",
    status: "active",
  },
  usage: {
    leads: { used: 24, limit: 50 },
    clients: { used: 48, limit: 100 },
    teamMembers: { used: 4, limit: 5 },
    storage: { used: 2.4, limit: 10, unit: "GB" },
  },
  paymentMethod: {
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiry: "12/27",
  },
  invoices: [
    {
      id: "INV-2026-001",
      date: "January 15, 2026",
      amount: 199,
      status: "paid",
    },
    {
      id: "INV-2025-012",
      date: "December 15, 2025",
      amount: 199,
      status: "paid",
    },
    {
      id: "INV-2025-011",
      date: "November 15, 2025",
      amount: 199,
      status: "paid",
    },
    {
      id: "INV-2025-010",
      date: "October 15, 2025",
      amount: 199,
      status: "paid",
    },
  ],
}

const plans = [
  {
    name: "Starter",
    price: 99,
    description: "For individual advisers getting started",
    features: [
      "Up to 20 leads/month",
      "Up to 30 clients",
      "1 team member",
      "Basic analytics",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: 199,
    description: "For growing practices",
    features: [
      "Up to 50 leads/month",
      "Up to 100 clients",
      "5 team members",
      "Advanced analytics",
      "Priority support",
      "AI copilot access",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 399,
    description: "For large firms and teams",
    features: [
      "Unlimited leads",
      "Unlimited clients",
      "Unlimited team members",
      "Custom analytics",
      "Dedicated support",
      "AI copilot access",
      "API access",
      "Custom integrations",
    ],
    highlighted: false,
  },
]

export default function BillingPage() {
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = React.useState(false)

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Current Plan
                <Badge className="bg-primary/10 text-primary">
                  {mockBilling.plan.name}
                </Badge>
              </CardTitle>
              <CardDescription>
                Your subscription renews on {mockBilling.plan.nextBillingDate}
              </CardDescription>
            </div>
            <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Zap className="size-4" />
                  Upgrade Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Choose Your Plan</DialogTitle>
                  <DialogDescription>
                    Select the plan that best fits your practice needs
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 md:grid-cols-3">
                  {plans.map((plan) => (
                    <Card
                      key={plan.name}
                      className={cn(
                        "relative",
                        plan.highlighted && "border-primary shadow-lg"
                      )}
                    >
                      {plan.highlighted && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                          Most Popular
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="pt-2">
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="size-4 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={plan.highlighted ? "default" : "outline"}
                          disabled={plan.name === mockBilling.plan.name}
                        >
                          {plan.name === mockBilling.plan.name
                            ? "Current Plan"
                            : `Switch to ${plan.name}`}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Crown className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{mockBilling.plan.name} Plan</p>
              <p className="text-sm text-muted-foreground">
                ${mockBilling.plan.price}/{mockBilling.plan.interval}
              </p>
            </div>
            <Badge status="active">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Usage This Month</CardTitle>
          <CardDescription>
            Track your usage against your plan limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {/* Leads */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Leads</span>
                <span className="text-muted-foreground">
                  {mockBilling.usage.leads.used} / {mockBilling.usage.leads.limit}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  mockBilling.usage.leads.used,
                  mockBilling.usage.leads.limit
                )}
              />
            </div>

            {/* Clients */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Active Clients</span>
                <span className="text-muted-foreground">
                  {mockBilling.usage.clients.used} / {mockBilling.usage.clients.limit}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  mockBilling.usage.clients.used,
                  mockBilling.usage.clients.limit
                )}
              />
            </div>

            {/* Team Members */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Team Members</span>
                <span className="text-muted-foreground">
                  {mockBilling.usage.teamMembers.used} / {mockBilling.usage.teamMembers.limit}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  mockBilling.usage.teamMembers.used,
                  mockBilling.usage.teamMembers.limit
                )}
              />
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage</span>
                <span className="text-muted-foreground">
                  {mockBilling.usage.storage.used} / {mockBilling.usage.storage.limit}{" "}
                  {mockBilling.usage.storage.unit}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  mockBilling.usage.storage.used,
                  mockBilling.usage.storage.limit
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="size-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded bg-muted">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <p className="font-medium">
                    {mockBilling.paymentMethod.brand} ****{" "}
                    {mockBilling.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {mockBilling.paymentMethod.expiry}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building className="size-5" />
              Billing Address
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Anderson Financial Services</p>
                <p className="text-sm text-muted-foreground">
                  123 Financial Street
                  <br />
                  Sydney, NSW 2000
                  <br />
                  Australia
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="size-5" />
                Invoice History
              </CardTitle>
              <CardDescription>
                Download past invoices for your records
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBilling.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount}.00</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="size-4" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
      <Card className="border-muted">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cancel Subscription</p>
              <p className="text-sm text-muted-foreground">
                You can cancel your subscription at any time. Your access will continue
                until the end of your billing period.
              </p>
            </div>
            <Button variant="ghost" className="text-destructive hover:text-destructive">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
