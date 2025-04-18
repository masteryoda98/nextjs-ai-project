import DashboardLayoutNew from "@/components/dashboard-layout-new"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink } from "lucide-react"

export default function CreatorSubmissions() {
  return (
    <DashboardLayoutNew userType="creator">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Submissions</h1>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search submissions..." className="w-full bg-background pl-8" />
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Submissions</CardTitle>
                <CardDescription>Submissions awaiting artist approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                          <ExternalLink className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Summer Vibes EP</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <span className="text-xs">Pending Review</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          View on TikTok
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Submissions</CardTitle>
                <CardDescription>Submissions that have been approved by artists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                          <ExternalLink className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{["Midnight Dance", "Urban Beats", "Summer Vibes EP"][i]}</p>
                          <p className="text-sm text-muted-foreground">
                            Approved on {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs">Approved</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-green-500">+${[40, 60, 50][i]}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          View on TikTok
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Submissions</CardTitle>
                <CardDescription>Submissions that were not approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 1 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                          <ExternalLink className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Urban Beats</p>
                          <p className="text-sm text-muted-foreground">
                            Rejected on {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-xs">Rejected</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          View on TikTok
                        </Button>
                        <div className="text-xs text-muted-foreground">Reason: Content doesn't match guidelines</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutNew>
  )
}
