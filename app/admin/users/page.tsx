import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { UserCheck, UserX, Filter, Download } from "lucide-react"

// Define the User type based on your database schema
type User = {
  id: string
  name: string
  role: string
  tiktok_handle: string | null
  follower_count: number | null
  created_at: string
  is_active: boolean
  is_verified: boolean | null
}

async function getUsers() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch users from your database
  const { data: users, error } = await supabase
    .from("creatoramp_users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return users
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
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

      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((user) => user.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Verified Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((user) => user.is_verified).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((user) => user.role === "ADMIN").length}</div>
          </CardContent>
        </Card>
      </div>

      {users.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>TikTok Handle</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.tiktok_handle || "-"}</TableCell>
                    <TableCell>{user.follower_count?.toLocaleString() || "-"}</TableCell>
                    <TableCell>{format(new Date(user.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                          <UserCheck className="mr-1 h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">
                          <UserX className="mr-1 h-3 w-3" /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/users/${user.id}`}>
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
            <h3 className="mt-4 text-lg font-semibold">No users found</h3>
            <p className="mb-4 mt-2 text-sm text-gray-500 dark:text-gray-400">There are no users in the system yet.</p>
          </div>
        </Card>
      )}
    </div>
  )
}
