"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Star,
  Eye,
  FileCheck,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

// Mock data for charts
const userGrowthData = [
  { month: "Jul", consumers: 1200, advisors: 180 },
  { month: "Aug", consumers: 1450, advisors: 210 },
  { month: "Sep", consumers: 1680, advisors: 245 },
  { month: "Oct", consumers: 1920, advisors: 290 },
  { month: "Nov", consumers: 2240, advisors: 340 },
  { month: "Dec", consumers: 2580, advisors: 395 },
  { month: "Jan", consumers: 2890, advisors: 450 },
]

const pageViewsData = [
  { date: "Mon", views: 4200, searches: 1800 },
  { date: "Tue", views: 5100, searches: 2200 },
  { date: "Wed", views: 4800, searches: 2100 },
  { date: "Thu", views: 5400, searches: 2400 },
  { date: "Fri", views: 4900, searches: 2000 },
  { date: "Sat", views: 3200, searches: 1200 },
  { date: "Sun", views: 2800, searches: 1000 },
]

const categoryDistributionData = [
  { name: "Financial Planning", value: 487, fill: "#14B8A6" },
  { name: "Wealth Management", value: 312, fill: "#0EA5E9" },
  { name: "Tax Planning", value: 224, fill: "#8B5CF6" },
  { name: "Retirement Planning", value: 156, fill: "#F59E0B" },
  { name: "Estate Planning", value: 189, fill: "#EF4444" },
  { name: "Other", value: 298, fill: "#6B7280" },
]

const reviewTrendsData = [
  { month: "Jul", reviews: 145, avgRating: 4.3 },
  { month: "Aug", reviews: 168, avgRating: 4.4 },
  { month: "Sep", reviews: 192, avgRating: 4.5 },
  { month: "Oct", reviews: 215, avgRating: 4.4 },
  { month: "Nov", reviews: 248, avgRating: 4.6 },
  { month: "Dec", reviews: 276, avgRating: 4.5 },
  { month: "Jan", reviews: 312, avgRating: 4.6 },
]

const claimStatusData = [
  { name: "Approved", value: 156, fill: "#10B981" },
  { name: "Pending", value: 23, fill: "#F59E0B" },
  { name: "Rejected", value: 12, fill: "#EF4444" },
]

const topPerformingCategories = [
  { category: "Financial Planning", searches: 12450, growth: 15.2 },
  { category: "Wealth Management", searches: 9820, growth: 12.8 },
  { category: "Tax Planning", searches: 7650, growth: 8.4 },
  { category: "Retirement Planning", searches: 6890, growth: 22.1 },
  { category: "Estate Planning", searches: 5420, growth: -3.2 },
]

const locationData = [
  { state: "NSW", advisors: 892, consumers: 24500 },
  { state: "VIC", advisors: 756, consumers: 21200 },
  { state: "QLD", advisors: 534, consumers: 15800 },
  { state: "WA", advisors: 312, consumers: 9400 },
  { state: "SA", advisors: 198, consumers: 5600 },
  { state: "Other", advisors: 155, consumers: 4200 },
]

// Chart configurations
const userGrowthConfig: ChartConfig = {
  consumers: {
    label: "Consumers",
    color: "#14B8A6",
  },
  advisors: {
    label: "Advisors",
    color: "#0EA5E9",
  },
}

const pageViewsConfig: ChartConfig = {
  views: {
    label: "Page Views",
    color: "#14B8A6",
  },
  searches: {
    label: "Searches",
    color: "#8B5CF6",
  },
}

const reviewsConfig: ChartConfig = {
  reviews: {
    label: "Reviews",
    color: "#14B8A6",
  },
  avgRating: {
    label: "Avg Rating",
    color: "#F59E0B",
  },
}

const locationConfig: ChartConfig = {
  advisors: {
    label: "Advisors",
    color: "#14B8A6",
  },
  consumers: {
    label: "Consumers",
    color: "#0EA5E9",
  },
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: React.ElementType
  trend: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {changeType === "positive" ? (
                <ArrowUpRight className="size-4 text-green-600" />
              ) : (
                <ArrowDownRight className="size-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-muted-foreground">{trend}</span>
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Icon className="size-6 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Platform performance metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="5,739"
          change="+12.5%"
          changeType="positive"
          icon={Users}
          trend="vs last period"
        />
        <StatCard
          title="Active Listings"
          value="2,134"
          change="+8.3%"
          changeType="positive"
          icon={Building2}
          trend="vs last period"
        />
        <StatCard
          title="Page Views"
          value="128.5K"
          change="+24.1%"
          changeType="positive"
          icon={Eye}
          trend="vs last period"
        />
        <StatCard
          title="Avg. Rating"
          value="4.6"
          change="-0.1"
          changeType="negative"
          icon={Star}
          trend="vs last period"
        />
      </div>

      {/* Main Analytics Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* User Growth Chart */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Monthly new user registrations by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={userGrowthConfig} className="h-[300px]">
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="consumers"
                      stackId="1"
                      stroke="#14B8A6"
                      fill="#14B8A6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="advisors"
                      stackId="1"
                      stroke="#0EA5E9"
                      fill="#0EA5E9"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>
                  Advisor listings by specialisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Page Views and Reviews */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Page Views & Searches</CardTitle>
                <CardDescription>Daily traffic over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={pageViewsConfig} className="h-[300px]">
                  <BarChart data={pageViewsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="views" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="searches" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Trends</CardTitle>
                <CardDescription>
                  Monthly reviews and average ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={reviewsConfig} className="h-[300px]">
                  <LineChart data={reviewTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 5]}
                      className="text-xs"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="reviews"
                      stroke="#14B8A6"
                      strokeWidth={2}
                      dot={{ fill: "#14B8A6" }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgRating"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: "#F59E0B" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Categories</CardTitle>
              <CardDescription>
                Categories ranked by search volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingCategories.map((category, index) => (
                  <div
                    key={category.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.searches.toLocaleString()} searches
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        category.growth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {category.growth >= 0 ? (
                        <TrendingUp className="size-4" />
                      ) : (
                        <TrendingDown className="size-4" />
                      )}
                      <span className="font-medium">
                        {category.growth >= 0 ? "+" : ""}
                        {category.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Registration Trend</CardTitle>
                <CardDescription>New registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={userGrowthConfig} className="h-[350px]">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      type="monotone"
                      dataKey="consumers"
                      stroke="#14B8A6"
                      strokeWidth={2}
                      dot={{ fill: "#14B8A6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="advisors"
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      dot={{ fill: "#0EA5E9" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users by Location</CardTitle>
                <CardDescription>Geographic distribution of users</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={locationConfig} className="h-[350px]">
                  <BarChart data={locationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis type="category" dataKey="state" className="text-xs" width={50} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="advisors" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="listings" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Claim Status Distribution</CardTitle>
                <CardDescription>Breakdown of claim request statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={claimStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {claimStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {claimStatusData.map((status) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: status.fill }}
                      />
                      <span className="text-sm">
                        {status.name}: {status.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Listings by Category</CardTitle>
                <CardDescription>Distribution of advisor specialisations</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[350px]">
                  <BarChart data={categoryDistributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      className="text-xs"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Traffic</CardTitle>
                <CardDescription>Page views and searches per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={pageViewsConfig} className="h-[350px]">
                  <AreaChart data={pageViewsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#14B8A6"
                      fill="#14B8A6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="searches"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Activity</CardTitle>
                <CardDescription>Monthly review submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={reviewsConfig} className="h-[350px]">
                  <BarChart data={reviewTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="reviews" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">3.2</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Avg. Pages per Session
                  </p>
                  <Badge status="active" className="mt-2">+8% vs last month</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">4:32</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Avg. Session Duration
                  </p>
                  <Badge status="active" className="mt-2">+12% vs last month</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">42%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Search to Contact Rate
                  </p>
                  <Badge status="pending" className="mt-2">-2% vs last month</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
