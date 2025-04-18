import DashboardLayoutNew from "@/components/dashboard-layout-new"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ArtistCampaigns() {
  return (
    <DashboardLayoutNew userType="artist">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <Button asChild>
            <Link href="/dashboard/artist/campaigns/create">
              <Plus className="mr-2 h-4 w-4" /> Create Campaign
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>You have 3 active campaigns running</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Summer Hit {i + 1}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs">Active</span>
                          </div>
                        </div>
                        <CardDescription>Created on {new Date().toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Budget:</span>
                            <span className="font-medium">${(Math.random() * 1000 + 500).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Submissions:</span>
                            <span className="font-medium">{Math.floor(Math.random() * 30) + 10}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Approved:</span>
                            <span className="font-medium">{Math.floor(Math.random() * 15) + 5}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" asChild className="w-full">
                              <Link href={`/dashboard/artist/campaigns/${i + 1}`}>View Details</Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild className="w-full">
                              <Link href={`/dashboard/artist/campaigns/${i + 1}/edit`}>Edit</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Campaigns</CardTitle>
                <CardDescription>You have 5 completed campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Spring Hit {i + 1}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-xs">Completed</span>
                          </div>
                        </div>
                        <CardDescription>
                          Completed on {new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Budget:</span>
                            <span className="font-medium">${(Math.random() * 1000 + 500).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Submissions:</span>
                            <span className="font-medium">{Math.floor(Math.random() * 50) + 20}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Approved:</span>
                            <span className="font-medium">{Math.floor(Math.random() * 30) + 10}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" asChild className="w-full">
                              <Link href={`/dashboard/artist/campaigns/${i + 1}/report`}>View Report</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Draft Campaigns</CardTitle>
                <CardDescription>You have 2 draft campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>New Track {i + 1}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <span className="text-xs">Draft</span>
                          </div>
                        </div>
                        <CardDescription>
                          Last edited on {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Budget:</span>
                            <span className="font-medium">${(Math.random() * 1000 + 500).toFixed(2)}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" asChild className="w-full">
                              <Link href={`/dashboard/artist/campaigns/${i + 1}/edit`}>Edit</Link>
                            </Button>
                            <Button size="sm" asChild className="w-full">
                              <Link href={`/dashboard/artist/campaigns/${i + 1}/launch`}>Launch</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
