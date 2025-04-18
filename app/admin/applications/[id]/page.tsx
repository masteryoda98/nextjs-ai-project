import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ReviewApplicationForm } from "@/app/admin/applications/[id]/review-form"

// Define the Application type based on your database schema
type Application = {
  id: string
  campaign_id: string
  user_id: string
  created_at: string
  status: "pending" | "approved" | "rejected"
  content: any
  campaign?: {
    name: string
    description: string
  }
  user?: {
    name: string
    tiktok_handle: string | null
    follower_count: number | null
    is_verified: boolean | null
  }
}

async function getApplication(id: string) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch application with campaign and user details
  const { data: application, error } = await supabase
    .from("applications")
    .select(`
      *,
      campaign:campaign_id (name, description),
      user:user_id (name, tiktok_handle, follower_count, is_verified)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching application:", error)
    return null
  }

  return application
}

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await getApplication(params.id)

  if (!application) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/applications">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Application Review</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Submitted {format(new Date(application.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </CardDescription>
              <div className="mt-2">
                <Badge
                  className={
                    application.status === "approved"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                      : application.status === "rejected"
                        ? "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
                  }
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Campaign</h3>
                <p className="text-gray-500 dark:text-gray-400">{application.campaign?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{application.campaign?.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Application Content</h3>
                {application.content ? (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-2">
                    <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(application.content, null, 2)}</pre>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No content provided</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3 dark:bg-gray-800/50">
              <ReviewApplicationForm applicationId={application.id} currentStatus={application.status} />
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Creator Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                <p className="font-medium">{application.user?.name}</p>
              </div>

              {application.user?.tiktok_handle && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">TikTok Handle</h3>
                  <p className="font-medium">{application.user.tiktok_handle}</p>
                </div>
              )}

              {application.user?.follower_count && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Followers</h3>
                  <p className="font-medium">{application.user.follower_count.toLocaleString()}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Verification</h3>
                {application.user?.is_verified ? (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                    <CheckCircle className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <XCircle className="mr-1 h-3 w-3" /> Not Verified
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3 dark:bg-gray-800/50">
              <Link href={`/admin/users/${application.user_id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View Creator Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
