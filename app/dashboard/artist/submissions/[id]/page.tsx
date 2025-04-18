import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayoutNew from "@/components/dashboard-layout-new"
import Link from "next/link"
import { ArrowLeft, Check, ExternalLink, ThumbsDown, ThumbsUp, X } from "lucide-react"

export default function SubmissionDetails({ params }: { params: { id: string } }) {
  const submissionId = params.id

  return (
    <DashboardLayoutNew userType="artist">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/artist/submissions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Submissions
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Submission #{submissionId}</h1>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span>Pending Review</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>TikTok Video</CardTitle>
              <CardDescription>Creator's submission for your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">TikTok Video Preview</p>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on TikTok
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
              <CardDescription>Information about this submission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Creator:</span>
                    <span className="font-medium">Creator Name</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Followers:</span>
                    <span className="font-medium">25.4K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Campaign:</span>
                    <Link href="/dashboard/artist/campaigns/1" className="font-medium text-primary">
                      Summer Hit 1
                    </Link>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submitted:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className="font-medium">Pending Review</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creator Message</CardTitle>
              <CardDescription>Note from the creator</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                I created this video using your song as the background music. I added a dance routine that I think
                matches the vibe of the track perfectly. Let me know what you think!
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Review Submission</CardTitle>
              <CardDescription>Approve or reject this submission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="feedback" className="text-sm font-medium">
                    Feedback (optional)
                  </label>
                  <textarea
                    id="feedback"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter feedback for the creator..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="w-full gap-2">
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button className="w-full gap-2">
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Approving will release payment to the creator</span>
                  <span>$25.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Analytics for this TikTok video</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 10000) + 1000}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Likes</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 1000) + 100}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Comments</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 100) + 10}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Shares</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 50) + 5}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Engagement rate: {(Math.random() * 5 + 2).toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Drop-off rate: {(Math.random() * 20 + 10).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayoutNew>
  )
}
