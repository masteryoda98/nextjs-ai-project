import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayoutNew from "@/components/dashboard-layout-new"
import Link from "next/link"
import { ArrowLeft, Calendar, DollarSign, Music, Users } from "lucide-react"

export default function CampaignDetails({ params }: { params: { id: string } }) {
  const campaignId = params.id

  return (
    <DashboardLayoutNew userType="artist">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/artist/campaigns">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Campaign #{campaignId}</h1>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Active</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(Math.random() * 1000 + 500).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">$120.00 spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(Math.random() * 30) + 10}</div>
              <p className="text-xs text-muted-foreground">+5 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(Math.random() * 15) + 5}</div>
              <p className="text-xs text-muted-foreground">+2 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30 days</div>
              <p className="text-xs text-muted-foreground">
                Ends on {new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Information about your campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Summer Hit {campaignId}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This campaign is for promoting your latest summer hit track. Creators will create TikTok videos
                  featuring your music.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Campaign Settings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Payment per submission:</span>
                      <span className="font-medium">$25.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Minimum followers:</span>
                      <span className="font-medium">10,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Content requirements:</span>
                      <span className="font-medium">15-30 second video</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Campaign Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Start date:</span>
                      <span className="font-medium">
                        {new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>End date:</span>
                      <span className="font-medium">
                        {new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/artist/campaigns/${campaignId}/edit`}>Edit Campaign</Link>
                </Button>
                <Button variant="outline">Pause Campaign</Button>
                <Button variant="destructive">End Campaign</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest content from creators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Creator {i + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${i % 3 === 0 ? "bg-green-500" : i % 3 === 1 ? "bg-yellow-500" : "bg-blue-500"}`}
                    />
                    <span className="text-xs">{i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Pending" : "New"}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/artist/submissions/${i + 1}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/artist/campaigns/${campaignId}/submissions`}>View All Submissions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutNew>
  )
}
