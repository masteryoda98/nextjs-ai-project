import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Download } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { format } from "date-fns"

// Define the Payout type based on your database schema
type Payout = {
  id: string
  user_id: string
  amount: number
  created_at: string
  status: "pending" | "processing" | "completed" | "failed"
  user?: {
    name: string
  }
}

async function getPayoutStats() {
  const supabase = createServerComponentClient({ cookies })

  // Get total paid amount (completed payouts)
  const { data: totalPaidData, error: totalPaidError } = await supabase
    .from("payouts")
    .select("amount")
    .eq("status", "completed")

  const totalPaid = totalPaidData?.reduce((sum, payout) => sum + payout.amount, 0) || 0

  // Get pending payouts amount
  const { data: pendingPayoutsData, error: pendingPayoutsError } = await supabase
    .from("payouts")
    .select("amount")
    .eq("status", "pending")

  const pendingPayouts = pendingPayoutsData?.reduce((sum, payout) => sum + payout.amount, 0) || 0
  const pendingCount = pendingPayoutsData?.length || 0

  // Get average payout amount
  const { data: avgPayoutData, error: avgPayoutError } = await supabase
    .from("payouts")
    .select("amount")
    .eq("status", "completed")

  let avgPayout = 0
  if (avgPayoutData && avgPayoutData.length > 0) {
    avgPayout = avgPayoutData.reduce((sum, payout) => sum + payout.amount, 0) / avgPayoutData.length
  }

  return {
    totalPaid,
    pendingPayouts,
    pendingCount,
    avgPayout,
  }
}

async function getPayouts() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch payouts with user details
  const { data: payouts, error } = await supabase
    .from("payouts")
    .select(`
      *,
      user:user_id (name)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching payouts:", error)
    return []
  }

  return payouts
}

export default async function AdminPayoutsPage() {
  const payouts = await getPayouts()
  const stats = await getPayoutStats()

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payouts</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
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
            <div className="text-2xl font-bold">{formatCurrency(stats.totalPaid)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingPayouts)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.pendingCount} {stats.pendingCount === 1 ? "creator" : "creators"} waiting
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgPayout)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Per approved submission</p>
          </CardContent>
        </Card>
      </div>

      {payouts.length > 0 ? (
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
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.id.substring(0, 8)}</TableCell>
                    <TableCell>{payout.user?.name || "Unknown User"}</TableCell>
                    <TableCell>{formatCurrency(payout.amount)}</TableCell>
                    <TableCell>{format(new Date(payout.created_at), "MMM d, yyyy")}</TableCell>
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
                      <Link href={`/admin/payouts/${payout.id}`}>
                        <Button variant="outline" size="sm">
                          Details
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
            <h3 className="mt-4 text-lg font-semibold">No payouts yet</h3>
            <p className="mb-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              There are no payouts to display yet. Payouts will appear here once you start processing payments to
              creators.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
