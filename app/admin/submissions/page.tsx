import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export default function AdminSubmissionsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

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
              {/* Sample submission rows - replace with real data */}
              {[
                {
                  id: "SUB-001",
                  campaign: "Summer Campaign",
                  creator: "John Doe",
                  date: "Apr 15, 2025",
                  status: "approved",
                },
                {
                  id: "SUB-002",
                  campaign: "Fall Collection",
                  creator: "Jane Smith",
                  date: "Apr 14, 2025",
                  status: "rejected",
                },
                {
                  id: "SUB-003",
                  campaign: "Winter Special",
                  creator: "Alex Johnson",
                  date: "Apr 13, 2025",
                  status: "pending",
                },
                {
                  id: "SUB-004",
                  campaign: "Spring Launch",
                  creator: "Sam Wilson",
                  date: "Apr 12, 2025",
                  status: "approved",
                },
                {
                  id: "SUB-005",
                  campaign: "Holiday Promo",
                  creator: "Taylor Swift",
                  date: "Apr 11, 2025",
                  status: "pending",
                },
              ].map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.id}</TableCell>
                  <TableCell>{submission.campaign}</TableCell>
                  <TableCell>{submission.creator}</TableCell>
                  <TableCell>{submission.date}</TableCell>
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
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty state for when there are no submissions */}
      {false && (
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
