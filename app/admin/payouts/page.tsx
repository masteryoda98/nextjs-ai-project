import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

export default function AdminPayoutsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payouts</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Process Payouts
          </Button>
        </div>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+5.4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,250.00</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">8 creators waiting</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$425.75</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Per approved submission</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Sample payout rows - replace with real data */}
              {[
                { id: "PAY-001", creator: "John Doe", amount: "$500.00", date: "Apr 15, 2025", status: "completed" },
                { id: "PAY-002", creator: "Jane Smith", amount: "$350.00", date: "Apr 14, 2025", status: "processing" },
                { id: "PAY-003", creator: "Alex Johnson", amount: "$425.00", date: "Apr 13, 2025", status: "pending" },
                { id: "PAY-004", creator: "Sam Wilson", amount: "$600.00", date: "Apr 12, 2025", status: "completed" },
                { id: "PAY-005", creator: "Taylor Swift", amount: "$475.00", date: "Apr 11, 2025", status: "failed" },
              ].map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.id}</TableCell>
                  <TableCell>{payout.creator}</TableCell>
                  <TableCell>{payout.amount}</TableCell>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        payout.status === "completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                          : payout.status === "processing"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                            : payout.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
