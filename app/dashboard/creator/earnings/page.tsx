import DashboardLayoutNew from "@/components/dashboard-layout-new"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, DollarSign, Calendar, ArrowUpRight } from "lucide-react"

export default function CreatorEarnings() {
  return (
    <DashboardLayoutNew userType="creator">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Earnings</h1>
          <div className="flex gap-2">
            <Select defaultValue="last30days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last3months">Last 3 Months</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$420.00</div>
              <p className="text-xs text-muted-foreground">From 6 approved submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$100.00</div>
              <p className="text-xs text-muted-foreground">From 2 pending submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Per Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$50.00</div>
              <p className="text-xs text-muted-foreground">Based on approved submissions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="campaigns">Earnings by Campaign</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Record of your earnings and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Received</p>
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
                        <p className="font-medium">$150.00</p>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          COMPLETED
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Received</p>
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
                        <p className="font-medium">$120.00</p>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          COMPLETED
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Received</p>
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
                        <p className="font-medium">$150.00</p>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          COMPLETED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Campaign</CardTitle>
                <CardDescription>Breakdown of your earnings by campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Summer Vibes EP</p>
                        <p className="text-sm text-muted-foreground">2 approved submissions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$100.00</p>
                      <p className="text-sm text-muted-foreground">$50.00 per submission</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Midnight Dance</p>
                        <p className="text-sm text-muted-foreground">3 approved submissions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$120.00</p>
                      <p className="text-sm text-muted-foreground">$40.00 per submission</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Urban Beats</p>
                        <p className="text-sm text-muted-foreground">1 approved submission</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$60.00</p>
                      <p className="text-sm text-muted-foreground">$60.00 per submission</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutNew>
  )
}
