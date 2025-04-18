"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import AdminProtectedRoute from "@/components/admin-protected-route"

// Sample data - in a real app, this would come from your API
const campaignPerformanceData = [
  { name: "Summer Vibes EP", submissions: 5, approved: 3, views: 15000 },
  { name: "New Single Midnight", submissions: 4, approved: 2, views: 12000 },
  { name: "Hip Hop Beats", submissions: 3, approved: 2, views: 8000 },
  { name: "Music Video Teaser", submissions: 2, approved: 1, views: 5000 },
  { name: "Acoustic Cover", submissions: 1, approved: 0, views: 0 },
]

const monthlySubmissionsData = [
  { month: "Jan", submissions: 12, approved: 8 },
  { month: "Feb", submissions: 15, approved: 10 },
  { month: "Mar", submissions: 18, approved: 12 },
  { month: "Apr", submissions: 22, approved: 15 },
  { month: "May", submissions: 25, approved: 18 },
  { month: "Jun", submissions: 30, approved: 22 },
  { month: "Jul", submissions: 35, approved: 25 },
  { month: "Aug", submissions: 40, approved: 30 },
  { month: "Sep", submissions: 45, approved: 35 },
  { month: "Oct", submissions: 50, approved: 38 },
  { month: "Nov", submissions: 55, approved: 42 },
  { month: "Dec", submissions: 60, approved: 45 },
]

const contentTypeData = [
  { name: "Dance", value: 35 },
  { name: "Lip Sync", value: 25 },
  { name: "Lifestyle", value: 20 },
  { name: "Review", value: 10 },
  { name: "Challenge", value: 10 },
]

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"]

const AnalyticsDashboardPage = () => {
  const [timeframe, setTimeframe] = useState("year")

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">+5 from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">+12 from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+35 from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+5% from last period</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns">
          <TabsList>
            <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
            <TabsTrigger value="submissions">Submission Trends</TabsTrigger>
            <TabsTrigger value="content">Content Types</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Submissions and approvals by campaign</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="submissions" fill="#8884d8" name="Total Submissions" />
                    <Bar dataKey="approved" fill="#82ca9d" name="Approved" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Views</CardTitle>
                <CardDescription>Estimated TikTok views by campaign</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" name="Estimated Views" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Submission Trends</CardTitle>
                <CardDescription>Submissions and approvals over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySubmissionsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="submissions" stroke="#8884d8" name="Total Submissions" />
                    <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="Approved" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Rate Over Time</CardTitle>
                  <CardDescription>Percentage of submissions approved</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlySubmissionsData.map((item) => ({
                        ...item,
                        approvalRate: Math.round((item.approved / item.submissions) * 100),
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="approvalRate" stroke="#8884d8" name="Approval Rate (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Submission Status Distribution</CardTitle>
                  <CardDescription>Current status of all submissions</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Approved", value: 45 },
                          { name: "Pending", value: 15 },
                          { name: "Needs Revision", value: 10 },
                          { name: "Rejected", value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: "Approved", value: 45, color: "#82ca9d" },
                          { name: "Pending", value: 15, color: "#8884d8" },
                          { name: "Needs Revision", value: 10, color: "#ffc658" },
                          { name: "Rejected", value: 5, color: "#ff8042" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
                <CardDescription>Breakdown of content types across all campaigns</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

export default function AnalyticsDashboard() {
  return (
    <AdminProtectedRoute>
      <AnalyticsDashboardPage />
    </AdminProtectedRoute>
  )
}
