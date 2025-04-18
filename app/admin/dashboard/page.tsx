import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Users, FileText, CheckSquare } from "lucide-react"

async function getDashboardStats() {
  const supabase = createServerComponentClient({ cookies })

  // Get campaign count
  const { count: campaignCount, error: campaignError } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })

  // Get user count
  const { count: userCount, error: userError } = await supabase
    .from("creatoramp_users")
    .select("*", { count: "exact", head: true })

  // Get pending applications count
  const { count: pendingApplicationsCount, error: appError } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  // Get submission count
  const { count: submissionCount, error: subError } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })

  return {
    campaignCount: campaignCount || 0,
    userCount: userCount || 0,
    pendingApplicationsCount: pendingApplicationsCount || 0,
    submissionCount: submissionCount || 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/admin/campaigns/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <PlusCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.campaignCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active marketing campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Registered creators and admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplicationsCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Applications awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <CheckSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissionCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total content submissions received</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest creator applications to your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <Link href="/admin/applications" className="block">
                <Button variant="outline" className="w-full">
                  View All Applications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Your currently active marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <Link href="/admin/campaigns" className="block">
                <Button variant="outline" className="w-full">
                  Manage Campaigns
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest content submissions from creators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <Link href="/admin/submissions" className="block">
                <Button variant="outline" className="w-full">
                  View All Submissions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
