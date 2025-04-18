import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, DollarSign, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DashboardLayout from "@/components/dashboard-layout"

export default function CreatorDashboard() {
  // This would normally come from the database
  const user = {
    name: "Alex Johnson",
    is_verified: true,
    follower_count: 25000,
    content_niche: "Dance",
  }

  return (
    <DashboardLayout userType="creator">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Creator Dashboard</h1>
          <Link href="/dashboard/creator/campaigns">
            <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black">Browse Campaigns</Button>
          </Link>
        </div>

        {!user.is_verified && (
          <Alert variant="destructive" className="bg-amber-900/20 text-amber-500 border-amber-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Required</AlertTitle>
            <AlertDescription>
              Your account is pending verification. You'll be able to apply for campaigns once verified.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-[#181818] border-[#282828] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Music className="h-4 w-4 text-[#1DB954]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.is_verified ? "3" : "0"}</div>
              <p className="text-xs text-gray-400">Campaigns you're participating in</p>
            </CardContent>
          </Card>
          <Card className="bg-[#181818] border-[#282828] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
              <Clock className="h-4 w-4 text-[#1DB954]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.is_verified ? "2" : "0"}</div>
              <p className="text-xs text-gray-400">Content awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="bg-[#181818] border-[#282828] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-[#1DB954]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.is_verified ? "$420" : "$0"}</div>
              <p className="text-xs text-gray-400">Lifetime earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-[#181818] border-[#282828] text-white">
            <CardHeader>
              <CardTitle>Your Active Campaigns</CardTitle>
              <CardDescription className="text-gray-400">Campaigns you're currently participating in</CardDescription>
            </CardHeader>
            <CardContent>
              {user.is_verified ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="Campaign thumbnail"
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-medium">Summer Vibes EP</h3>
                        <p className="text-xs text-gray-400">Dance challenge • $50 per approved video</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#1DB954] text-black">Active</Badge>
                      <Button variant="outline" size="sm" className="border-[#282828] text-white hover:bg-[#282828]">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="Campaign thumbnail"
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-medium">Midnight Dance</h3>
                        <p className="text-xs text-gray-400">Lip sync • $40 per approved video</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#1DB954] text-black">Active</Badge>
                      <Button variant="outline" size="sm" className="border-[#282828] text-white hover:bg-[#282828]">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="Campaign thumbnail"
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-medium">Urban Beats</h3>
                        <p className="text-xs text-gray-400">Freestyle dance • $60 per approved video</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#1DB954] text-black">Active</Badge>
                      <Button variant="outline" size="sm" className="border-[#282828] text-white hover:bg-[#282828]">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Campaigns</h3>
                  <p className="text-sm text-gray-400 text-center max-w-md mb-4">
                    Your account needs to be verified before you can participate in campaigns.
                  </p>
                  <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black">Complete Verification</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-3 bg-[#181818] border-[#282828] text-white">
            <CardHeader>
              <CardTitle>Creator Profile</CardTitle>
              <CardDescription className="text-gray-400">Your TikTok creator information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/placeholder.svg?height=80&width=80"
                  alt="Creator profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-[#282828] text-gray-300">
                      {user.content_niche}
                    </Badge>
                    {user.is_verified ? (
                      <Badge className="bg-[#1DB954]/20 text-[#1DB954] border-0">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/50 text-amber-500">
                        Pending Verification
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">TikTok Followers</p>
                  <p className="font-medium">{user.follower_count.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Content Niche</p>
                  <p className="font-medium">{user.content_niche}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Account Status</p>
                  <p className="font-medium">{user.is_verified ? "Verified" : "Pending Verification"}</p>
                </div>
                <Button variant="outline" className="w-full border-[#282828] text-white hover:bg-[#282828]">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
