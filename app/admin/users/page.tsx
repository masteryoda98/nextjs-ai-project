"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RefreshCw, ExternalLink, UserCheck, UserX, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type User = {
  id: string
  name: string
  email: string
  role: string
  tiktokHandle?: string
  followerCount?: number
  contentNiche?: string
  isVerified: boolean
  artistName?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("creatoramp_users")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setUsers(
        data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email || "No email provided",
          role: user.role,
          tiktokHandle: user.tiktok_handle,
          followerCount: user.follower_count,
          contentNiche: user.content_niche,
          isVerified: user.is_verified,
          artistName: user.artist_name,
          createdAt: user.created_at,
        })),
      )
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUser = async (verified: boolean) => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("creatoramp_users")
        .update({ is_verified: verified })
        .eq("id", selectedUser.id)

      if (error) throw error

      toast({
        title: verified ? "User Verified" : "User Verification Removed",
        description: `${selectedUser.name} has been ${verified ? "verified" : "unverified"} successfully.`,
      })

      // Update local state
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, isVerified: verified } : user)))

      setVerifyDialogOpen(false)
    } catch (error) {
      console.error("Error updating user verification:", error)
      toast({
        title: "Error",
        description: "Failed to update user verification status",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.tiktokHandle && user.tiktokHandle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.artistName && user.artistName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <Button onClick={fetchUsers} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Administrators</SelectItem>
                <SelectItem value="ARTIST">Artists</SelectItem>
                <SelectItem value="CREATOR">Creators</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="unverified">Unverified</TabsTrigger>
          </TabsList>

          {["all", "verified", "unverified"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <p>Loading users...</p>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {tab === "all" ? "All Users" : tab === "verified" ? "Verified Users" : "Unverified Users"}
                    </CardTitle>
                    <CardDescription>
                      {
                        filteredUsers.filter((user) => {
                          if (tab === "verified") return user.isVerified
                          if (tab === "unverified") return !user.isVerified
                          return true
                        }).length
                      }{" "}
                      users found
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 p-4 font-medium border-b">
                        <div className="col-span-4">User</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Joined</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                      <div className="divide-y">
                        {filteredUsers
                          .filter((user) => {
                            if (tab === "verified") return user.isVerified
                            if (tab === "unverified") return !user.isVerified
                            return true
                          })
                          .map((user) => (
                            <div key={user.id} className="grid grid-cols-12 p-4 items-center">
                              <div className="col-span-4">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage
                                      src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                                    />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    {user.tiktokHandle && (
                                      <p className="text-xs text-muted-foreground">{user.tiktokHandle}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <Badge variant="outline">
                                  {user.role === "ADMIN" ? "Admin" : user.role === "ARTIST" ? "Artist" : "Creator"}
                                </Badge>
                              </div>
                              <div className="col-span-2">
                                {user.isVerified ? (
                                  <Badge className="bg-green-500">Verified</Badge>
                                ) : (
                                  <Badge variant="outline">Unverified</Badge>
                                )}
                              </div>
                              <div className="col-span-2 text-sm text-muted-foreground">
                                {formatDate(user.createdAt)}
                              </div>
                              <div className="col-span-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedUser(user)
                                        setVerifyDialogOpen(true)
                                      }}
                                    >
                                      {user.isVerified ? (
                                        <>
                                          <UserX className="h-4 w-4 mr-2" />
                                          Remove Verification
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="h-4 w-4 mr-2" />
                                          Verify User
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    {user.role === "CREATOR" && user.tiktokHandle && (
                                      <DropdownMenuItem
                                        onClick={() => window.open(`https://tiktok.com/${user.tiktokHandle}`, "_blank")}
                                      >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View TikTok Profile
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!loading &&
                filteredUsers.filter((user) => {
                  if (tab === "verified") return user.isVerified
                  if (tab === "unverified") return !user.isVerified
                  return true
                }).length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser?.isVerified ? "Remove Verification" : "Verify User"}</DialogTitle>
            <DialogDescription>
              {selectedUser?.isVerified
                ? "Are you sure you want to remove verification from this user?"
                : "Verifying this user will allow them to participate fully on the platform."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedUser && (
              <div className="flex items-center gap-3 p-3 rounded-md border">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${selectedUser.name.charAt(0)}`} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  {selectedUser.tiktokHandle && (
                    <p className="text-xs text-muted-foreground">{selectedUser.tiktokHandle}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleVerifyUser(!selectedUser?.isVerified)}
              disabled={isSubmitting}
              variant={selectedUser?.isVerified ? "destructive" : "default"}
            >
              {isSubmitting ? "Processing..." : selectedUser?.isVerified ? "Remove Verification" : "Verify User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
