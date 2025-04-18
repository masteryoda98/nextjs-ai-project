import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminApplicationsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

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
              {/* Sample application rows - replace with real data */}
              {[
                {
                  id: "APP-001",
                  creator: "John Doe",
                  campaign: "Summer Campaign",
                  date: "Apr 15, 2025",
                  status: "approved",
                },
                {
                  id: "APP-002",
                  creator: "Jane Smith",
                  campaign: "Fall Collection",
                  date: "Apr 14, 2025",
                  status: "rejected",
                },
                {
                  id: "APP-003",
                  creator: "Alex Johnson",
                  campaign: "Winter Special",
                  date: "Apr 13, 2025",
                  status: "pending",
                },
                {
                  id: "APP-004",
                  creator: "Sam Wilson",
                  campaign: "Spring Launch",
                  date: "Apr 12, 2025",
                  status: "approved",
                },
                {
                  id: "APP-005",
                  creator: "Taylor Swift",
                  campaign: "Holiday Promo",
                  date: "Apr 11, 2025",
                  status: "pending",
                },
              ].map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.id}</TableCell>
                  <TableCell>{application.creator}</TableCell>
                  <TableCell>{application.campaign}</TableCell>
                  <TableCell>{application.date}</TableCell>
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
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty state for when there are no applications */}
      {false && (
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
