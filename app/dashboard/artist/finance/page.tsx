"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Calendar, RefreshCw, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

// Dynamically import client-only components
const DatePicker = dynamic(() => import("@/components/ui/date-picker").then((mod) => mod.DatePicker), { ssr: false })
const LineChart = dynamic(() => import("@/components/charts").then((mod) => mod.LineChart), { ssr: false })
const BarChart = dynamic(() => import("@/components/charts").then((mod) => mod.BarChart), { ssr: false })
const PieChart = dynamic(() => import("@/components/charts").then((mod) => mod.PieChart), { ssr: false })

// Mock function for getCurrentUser since we're making this client-only
const getCurrentUser = async () => {
  return { id: "123", name: "Artist User" }
}

export default function ArtistFinancePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [reportPeriod, setReportPeriod] = useState("last30days")
  const [spendingByPeriod, setSpendingByPeriod] = useState([])
  const [spendingByCampaign, setSpendingByCampaign] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [summary, setSummary] = useState({
    totalSpent: 0,
    activeCampaigns: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
    averageSubmissionCost: 0,
  })

  useEffect(() => {
    fetchFinanceData()
  }, [reportPeriod])

  const fetchFinanceData = async () => {
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("User not authenticated")
      }

      // In a real implementation, this would be an API call to fetch data
      // For now, we'll simulate the data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate spending by period data
      let periodData = []

      if (reportPeriod === "last30days") {
        // Daily data for last 30 days
        periodData = Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          return {
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            spent: Math.round(Math.random() * 500 * 100) / 100,
            submissions: Math.floor(Math.random() * 5),
          }
        })
      } else if (reportPeriod === "last6months") {
        // Monthly data for last 6 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentMonth = new Date().getMonth()

        periodData = Array.from({ length: 6 }, (_, i) => {
          const monthIndex = (currentMonth - i + 12) % 12
          return {
            date: months[monthIndex],
            spent: Math.round(Math.random() * 5000 * 100) / 100,
            submissions: Math.floor(Math.random() * 30) + 10,
          }
        }).reverse()
      } else if (reportPeriod === "lastyear") {
        // Monthly data for last year
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentMonth = new Date().getMonth()

        periodData = Array.from({ length: 12 }, (_, i) => {
          const monthIndex = (currentMonth - i + 12) % 12
          return {
            date: months[monthIndex],
            spent: Math.round(Math.random() * 5000 * 100) / 100,
            submissions: Math.floor(Math.random() * 30) + 10,
          }
        }).reverse()
      }

      setSpendingByPeriod(periodData)

      // Generate spending by campaign data
      const campaignData = [
        {
          campaign: "Summer Hits",
          spent: Math.round(Math.random() * 5000 * 100) / 100,
          submissions: Math.floor(Math.random() * 30) + 10,
        },
        {
          campaign: "New Release",
          spent: Math.round(Math.random() * 4000 * 100) / 100,
          submissions: Math.floor(Math.random() * 25) + 5,
        },
        {
          campaign: "Viral Challenge",
          spent: Math.round(Math.random() * 3500 * 100) / 100,
          submissions: Math.floor(Math.random() * 20) + 5,
        },
        {
          campaign: "Album Promotion",
          spent: Math.round(Math.random() * 3000 * 100) / 100,
          submissions: Math.floor(Math.random() * 15) + 5,
        },
        {
          campaign: "Music Video",
          spent: Math.round(Math.random() * 2500 * 100) / 100,
          submissions: Math.floor(Math.random() * 10) + 5,
        },
      ]

      setSpendingByCampaign(campaignData)

      // Generate performance data
      const performanceData = [
        { metric: "Views", value: Math.floor(Math.random() * 1000000) + 500000 },
        { metric: "Likes", value: Math.floor(Math.random() * 100000) + 50000 },
        { metric: "Comments", value: Math.floor(Math.random() * 10000) + 5000 },
        { metric: "Shares", value: Math.floor(Math.random() * 5000) + 1000 },
        { metric: "Saves", value: Math.floor(Math.random() * 2000) + 500 },
      ]

      setPerformanceData(performanceData)

      // Calculate summary
      const totalSpent = periodData.reduce((sum, item) => sum + item.spent, 0)
      const totalSubmissions = periodData.reduce((sum, item) => sum + item.submissions, 0)

      setSummary({
        totalSpent,
        activeCampaigns: 3,
        totalSubmissions,
        pendingSubmissions: Math.floor(Math.random() * 10),
        approvedSubmissions: Math.floor(totalSubmissions * 0.8),
        rejectedSubmissions: Math.floor(totalSubmissions * 0.1),
        averageSubmissionCost: totalSubmissions > 0 ? totalSpent / totalSubmissions : 0,
      })
    } catch (error) {
      console.error("Error fetching finance data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch financial data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Your ${format.toUpperCase()} report is being generated and will download shortly.`,
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${format.toUpperCase()} report has been downloaded.`,
      })
    }, 2000)
  }

  // Create a safe render function to handle undefined values
  const safeRender = (condition, component) => {
    return condition ? component : null
  }

  return (
    <DashboardLayout userType="artist">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Campaign Finance</h1>
          <div className="flex gap-2">
            <Button onClick={fetchFinanceData} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last6months">Last 6 Months</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</div>
                  <p className="text-xs text-muted-foreground">Across {summary.activeCampaigns} active campaigns</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary.approvedSubmissions} approved (
                    {summary.totalSubmissions > 0
                      ? Math.round((summary.approvedSubmissions / summary.totalSubmissions) * 100)
                      : 0}
                    %)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Cost Per Submission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(summary.averageSubmissionCost)}</div>
                  <p className="text-xs text-muted-foreground">Based on approved submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">ROI Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2x</div>
                  <p className="text-xs text-muted-foreground">Based on engagement metrics</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <Tabs defaultValue="spending">
          <TabsList>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="spending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Over Time</CardTitle>
                <CardDescription>
                  Your campaign spending for the{" "}
                  {reportPeriod === "last30days"
                    ? "last 30 days"
                    : reportPeriod === "last6months"
                      ? "last 6 months"
                      : "last year"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {!loading && spendingByPeriod.length > 0 && (
                    <LineChart
                      data={spendingByPeriod}
                      categories={["spent"]}
                      index="date"
                      colors={["#0ea5e9"]}
                      valueFormatter={(value) => formatCurrency(value)}
                      showLegend={false}
                      showYAxis={true}
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="gap-2" onClick={() => exportReport("csv")}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending vs. Submissions</CardTitle>
                <CardDescription>Correlation between your spending and content submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {!loading && spendingByPeriod.length > 0 && (
                    <LineChart
                      data={spendingByPeriod}
                      categories={["spent", "submissions"]}
                      index="date"
                      colors={["#0ea5e9", "#f97316"]}
                      valueFormatter={(value, category) =>
                        category === "spent" ? formatCurrency(value) : `${value} submissions`
                      }
                      showLegend={true}
                      showYAxis={true}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Campaign</CardTitle>
                <CardDescription>Budget allocation across your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {!loading && spendingByCampaign.length > 0 && (
                    <BarChart
                      data={spendingByCampaign.map((c) => ({ campaign: c.campaign, spent: c.spent }))}
                      categories={["spent"]}
                      index="campaign"
                      colors={["#0ea5e9"]}
                      valueFormatter={(value) => formatCurrency(value)}
                      showLegend={false}
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="gap-2" onClick={() => exportReport("csv")}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Efficiency</CardTitle>
                <CardDescription>Cost per submission by campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!loading &&
                    spendingByCampaign.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{campaign.campaign}</p>
                            <p className="text-sm text-muted-foreground">{campaign.submissions} submissions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(campaign.spent)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(campaign.submissions > 0 ? campaign.spent / campaign.submissions : 0)} per
                            submission
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-[300px]">
                    {!loading && summary && (
                      <PieChart
                        data={[
                          { name: "Approved", value: summary.approvedSubmissions, percentage: 0 },
                          { name: "Pending", value: summary.pendingSubmissions, percentage: 0 },
                          { name: "Rejected", value: summary.rejectedSubmissions, percentage: 0 },
                        ]}
                        category="value"
                        index="name"
                        valueFormatter={(value) => `${value} submissions`}
                        showLabel={true}
                        showTooltip={true}
                      />
                    )}
                  </div>
                  <div className="h-[300px]">
                    {!loading && performanceData.length > 0 && (
                      <BarChart
                        data={performanceData}
                        categories={["value"]}
                        index="metric"
                        colors={["#0ea5e9"]}
                        valueFormatter={(value) => value.toLocaleString()}
                        showLegend={false}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Return on investment analysis for your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Engagement Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {!loading &&
                        performanceData.map((item, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{item.metric}</p>
                          </div>
                        ))}
                    </div>
                  </div>

                  {!loading && performanceData.length > 0 && summary && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Cost Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center">
                          <p className="text-2xl font-bold">
                            {formatCurrency(
                              performanceData[0]?.value > 0
                                ? (summary.totalSpent / performanceData[0].value) * 1000
                                : 0,
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">Cost per 1,000 Views</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-2xl font-bold">
                            {formatCurrency(
                              performanceData[1]?.value > 0
                                ? (summary.totalSpent / performanceData[1].value) * 1000
                                : 0,
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">Cost per 1,000 Likes</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-2xl font-bold">
                            {formatCurrency(
                              performanceData[3]?.value > 0 ? summary.totalSpent / performanceData[3].value : 0,
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">Cost per Share</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Record of your campaign payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Summer Hits Campaign Funding</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>June 15, 2023</span>
                          <span>•</span>
                          <span>PayPal</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(5000)}</p>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          COMPLETED
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">New Release Campaign Funding</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>May 22, 2023</span>
                          <span>•</span>
                          <span>PayPal</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(3500)}</p>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          COMPLETED
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Viral Challenge Campaign Funding</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>April 10, 2023</span>
                          <span>•</span>
                          <span>PayPal</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(4200)}</p>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          COMPLETED
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Need a custom invoice? Select a date range:</p>
                  <div className="mt-2">
                    {typeof window !== "undefined" && (
                      <DatePicker
                        selected={dateRange}
                        onSelect={setDateRange}
                        className="w-full"
                        placeholder="Select date range"
                      />
                    )}
                  </div>
                </div>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Generate Custom Invoice
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
