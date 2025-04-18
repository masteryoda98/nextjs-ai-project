import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Filter } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { format } from "date-fns"

// Define the Application type based on your database schema
type Application = {
  id: string
  campaign_id: string
  user_id: string
  created_at: string
  status: "pending" | "approved" | "rejected"
  campaign?: {
    name: string
  }
  user?: {
    name: string
  }
}

async function getApplications() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch applications with campaign and user details
  const { data: applications, error } = await supabase
    .from("applications")
    .select(`
      *,
      campaign:campaign_id (name),
      user:user_id (name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching applications:", error)
    return []
  }

  return applications
}

export default async function AdminApplicationsPage() {
  const applications = await getApplications()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {applications.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id.substring(0, 8)}</TableCell>
                    <TableCell>{application.user?.name || "Unknown User"}</TableCell>
                    <TableCell>{application.campaign?.name || "Unknown Campaign"}</TableCell>
                    <TableCell>{format(new Date(application.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/applications/${application.id}`}>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No applications yet</h3>
            <p className="mb-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              There are no applications to review yet. Applications will appear here once creators start applying to
              your campaigns.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
