import DashboardLayoutNew from "@/components/dashboard-layout-new"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search } from "lucide-react"

export default function ArtistSubmissions() {
  return (
    <DashboardLayoutNew userType="artist">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Submissions</h1>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search submissions..." className="w-full bg-background pl-8" />
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Submissions</CardTitle>
                <CardDescription>Submissions awaiting your review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Creator {i + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted for: Campaign {Math.floor(Math.random() * 3) + 1}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="text-xs">Pending</span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/artist/submissions/${i + 1}`}>Review</Link>
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
                <CardDescription>Submissions you have approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Creator {i + 10}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted for: Campaign {Math.floor(Math.random() * 3) + 1}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Approved on {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs">Approved</span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/artist/submissions/${i + 10}`}>View</Link>
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
                <CardDescription>Submissions you have rejected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Creator {i + 20}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted for: Campaign {Math.floor(Math.random() * 3) + 1}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rejected on {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs">Rejected</span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/artist/submissions/${i + 20}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Submissions</CardTitle>
                <CardDescription>All submissions across your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Creator {i + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted for: Campaign {Math.floor(Math.random() * 3) + 1}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            i % 3 === 0 ? "bg-green-500" : i % 3 === 1 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-xs">
                          {i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Pending" : "Rejected"}
                        </span>
                        <Button variant={i % 3 === 1 ? "outline" : "ghost"} size="sm" asChild>
                          <Link href={`/dashboard/artist/submissions/${i + 1}`}>{i % 3 === 1 ? "Review" : "View"}</Link>
                        </Button>
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
