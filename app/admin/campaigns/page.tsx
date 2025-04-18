import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Define the Campaign type based on your database schema
type Campaign = {
  id: string
  name: string
  description: string
  created_at: string
  is_active: boolean
  submission_count?: number
}

async function getCampaigns() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch campaigns from your database
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching campaigns:", error)
    return []
  }

  // For each campaign, get the submission count
  const campaignsWithSubmissionCount = await Promise.all(
    campaigns.map(async (campaign) => {
      const { count, error: countError } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", campaign.id)

      return {
        ...campaign,
        submission_count: count || 0,
      }
    }),
  )

  return campaignsWithSubmissionCount
}

export default async function AdminCampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Link href="/admin/campaigns/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>
                  Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {campaign.description || "No description provided."}
                </p>
                <div className="mt-4 flex items-center text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      campaign.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {campaign.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="ml-4 text-gray-500 dark:text-gray-400">
                    {campaign.submission_count} {campaign.submission_count === 1 ? "submission" : "submissions"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3 dark:bg-gray-800/50">
                <Link href={`/admin/campaigns/${campaign.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No campaigns yet</h3>
            <p className="mb-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              You haven't created any campaigns yet. Create your first campaign to start receiving submissions.
            </p>
            <Link href="/admin/campaigns/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
