import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Download, Filter } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { format } from "date-fns"

// Define the Submission type based on your database schema
type Submission = {
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

async function getSubmissions() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch submissions with campaign and user details
  const { data: submissions, error } = await supabase
    .from("submissions")
    .select(`
      *,
      campaign:campaign_id (name),
      user:user_id (name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching submissions:", error)
    return []
  }

  return submissions
}

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Submissions</h1>
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

      {submissions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.id.substring(0, 8)}</TableCell>
                    <TableCell>{submission.campaign?.name || "Unknown Campaign"}</TableCell>
                    <TableCell>{submission.user?.name || "Unknown User"}</TableCell>
                    <TableCell>{format(new Date(submission.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {submission.status === "approved" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" /> Approved
                        </Badge>
                      )}
                      {submission.status === "rejected" && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">
                          <XCircle className="mr-1 h-3 w-3" /> Rejected
                        </Badge>
                      )}
                      {submission.status === "pending" && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300">
                          <Clock className="mr-1 h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/submissions/${submission.id}`}>
                        <Button variant="outline" size="sm">
                          View
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
            <h3 className="mt-4 text-lg font-semibold">No submissions yet</h3>
            <p className="mb-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              There are no submissions to review yet. Submissions will appear here once creators start applying to your
              campaigns.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
