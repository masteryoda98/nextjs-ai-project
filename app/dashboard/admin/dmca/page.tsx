"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Eye, CheckCircle, MoreHorizontal } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import AdminProtectedRoute from "@/components/admin-protected-route"

type DMCARequest = {
  id: number
  content_type: string
  content_id: number
  claimant_name: string
  claimant_email: string
  claimant_address: string
  copyrighted_work: string
  infringing_material: string
  good_faith_statement: boolean
  status: "PENDING" | "APPROVED" | "REJECTED" | "COUNTER_NOTICE"
  admin_notes: string | null
  content_removed: boolean
  counter_notice_received: boolean
  counter_notice_details: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  content_title?: string
  content_owner?: string
}

const DMCAManagementPage = () => {
  const { toast } = useToast()
  const [dmcaRequests, setDmcaRequests] = useState<DMCARequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<DMCARequest | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  useEffect(() => {
    fetchDMCARequests()
  }, [])

  const fetchDMCARequests = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("dmca_requests").select("*").order("created_at", { ascending: false })

      if (error) throw error

      // Fetch additional content information
      const enrichedData = await Promise.all(
        data.map(async (request) => {
          let contentTitle = "Unknown Content"
          let contentOwner = "Unknown User"

          if (request.content_type === "SUBMISSION") {
            const { data: submission } = await supabase
              .from("submissions")
              .select(`
                caption,
                creator_id,
                creatoramp_users(name)
              `)
              .eq("id", request.content_id)
              .single()

            if (submission) {
              contentTitle = submission.caption || `Submission #${request.content_id}`
              contentOwner = submission.creatoramp_users?.name || "Unknown Creator"
            }
          } else if (request.content_type === "CAMPAIGN") {
            const { data: campaign } = await supabase
              .from("campaigns")
              .select(`
                name,
                artist_id,
                creatoramp_users(name)
              `)
              .eq("id", request.content_id)
              .single()

            if (campaign) {
              contentTitle = campaign.name || `Campaign #${request.content_id}`
              contentOwner = campaign.creatoramp_users?.name || "Unknown Artist"
            }
          }

          return {
            ...request,
            content_title: contentTitle,
            content_owner: contentOwner,
          }
        }),
      )

      setDmcaRequests(enrichedData)
    } catch (error) {
      console.error("Error fetching DMCA requests:", error)
      toast({
        title: "Error",
        description: "Failed to fetch DMCA requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReviewDMCA = async (approved: boolean) => {
    if (!selectedRequest) return

    setIsSubmitting(true)
    try {
      // Update the DMCA request status
      const { error } = await supabase
        .from("dmca_requests")
        .update({
          status: approved ? "APPROVED" : "REJECTED",
          admin_notes: adminNotes,
          content_removed: approved,
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id)

      if (error) throw error

      // If approved, remove the content
      if (approved) {
        if (selectedRequest.content_type === "SUBMISSION") {
          const { error: submissionError } = await supabase
            .from("submissions")
            .update({
              status: "REMOVED_DMCA",
              updated_at: new Date().toISOString(),
            })
            .eq("id", selectedRequest.content_id)

          if (submissionError) throw submissionError
        } else if (selectedRequest.content_type === "CAMPAIGN") {
          const { error: campaignError } = await supabase
            .from("campaigns")
            .update({
              status: "REMOVED_DMCA",
              updated_at: new Date().toISOString(),
            })
            .eq("id", selectedRequest.content_id)

          if (campaignError) throw campaignError
        }
      }

      toast({
        title: approved ? "DMCA Request Approved" : "DMCA Request Rejected",
        description: `The DMCA request has been ${approved ? "approved" : "rejected"} successfully.`,
      })

      // Update local state
      setDmcaRequests(
        dmcaRequests.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: approved ? "APPROVED" : "REJECTED",
                admin_notes: adminNotes,
                content_removed: approved,
                resolved_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : request,
        ),
      )

      setReviewDialogOpen(false)
      setAdminNotes("")
    } catch (error) {
      console.error("Error reviewing DMCA request:", error)
      toast({
        title: "Error",
        description: "Failed to review DMCA request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCounterNotice = async () => {
    if (!selectedRequest) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("dmca_requests")
        .update({
          status: "COUNTER_NOTICE",
          counter_notice_received: true,
          counter_notice_details: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id)

      if (error) throw error

      toast({
        title: "Counter Notice Recorded",
        description: "The counter notice has been recorded successfully.",
      })

      // Update local state
      setDmcaRequests(
        dmcaRequests.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: "COUNTER_NOTICE",
                counter_notice_received: true,
                counter_notice_details: adminNotes,
                updated_at: new Date().toISOString(),
              }
            : request,
        ),
      )

      setReviewDialogOpen(false)
      setAdminNotes("")
    } catch (error) {
      console.error("Error recording counter notice:", error)
      toast({
        title: "Error",
        description: "Failed to record counter notice",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredRequests = dmcaRequests.filter((request) => {
    const matchesSearch =
      request.claimant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.claimant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.copyrighted_work.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.infringing_material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.content_title && request.content_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.content_owner && request.content_owner.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a")
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">DMCA Takedown Requests</h1>
          <Button onClick={fetchDMCARequests} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dmcaRequests.filter((request) => request.status === "PENDING").length}
              </div>
              <p className="text-xs text-muted-foreground">Requests awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dmcaRequests.filter((request) => request.status === "APPROVED").length}
              </div>
              <p className="text-xs text-muted-foreground">Requests that were approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dmcaRequests.filter((request) => request.status === "REJECTED").length}
              </div>
              <p className="text-xs text-muted-foreground">Requests that were rejected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Counter Notices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dmcaRequests.filter((request) => request.status === "COUNTER_NOTICE").length}
              </div>
              <p className="text-xs text-muted-foreground">Requests with counter notices</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search by name, email, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="COUNTER_NOTICE">Counter Notice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          {["all", "pending", "resolved"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tab === "all" ? "All DMCA Requests" : tab === "pending" ? "Pending Requests" : "Resolved Requests"}
                  </CardTitle>
                  <CardDescription>
                    {
                      filteredRequests.filter((request) => {
                        if (tab === "pending") return request.status === "PENDING"
                        if (tab === "resolved")
                          return ["APPROVED", "REJECTED", "COUNTER_NOTICE"].includes(request.status)
                        return true
                      }).length
                    }{" "}
                    requests found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <p>Loading requests...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredRequests
                        .filter((request) => {
                          if (tab === "pending") return request.status === "PENDING"
                          if (tab === "resolved")
                            return ["APPROVED", "REJECTED", "COUNTER_NOTICE"].includes(request.status)
                          return true
                        })
                        .map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  request.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : request.status === "APPROVED"
                                      ? "bg-green-100 text-green-600"
                                      : request.status === "REJECTED"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {request.status === "PENDING" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                  </svg>
                                ) : request.status === "APPROVED" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                  </svg>
                                ) : request.status === "REJECTED" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {request.content_type}: {request.content_title}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>From: {request.claimant_name}</span>
                                  <span>•</span>
                                  <span>{formatDate(request.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  request.status === "PENDING"
                                    ? "outline"
                                    : request.status === "APPROVED"
                                      ? "default"
                                      : request.status === "REJECTED"
                                        ? "destructive"
                                        : "secondary"
                                }
                              >
                                {request.status === "PENDING"
                                  ? "Pending"
                                  : request.status === "APPROVED"
                                    ? "Approved"
                                    : request.status === "REJECTED"
                                      ? "Rejected"
                                      : "Counter Notice"}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedRequest(request)
                                      setDetailsDialogOpen(true)
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  {request.status === "PENDING" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedRequest(request)
                                          setAdminNotes("")
                                          setReviewDialogOpen(true)
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Review Request
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {request.status === "APPROVED" && !request.counter_notice_received && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedRequest(request)
                                        setAdminNotes("")
                                        setReviewDialogOpen(true)
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 mr-2"
                                      >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                      </svg>
                                      Record Counter Notice
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}

                      {filteredRequests.filter((request) => {
                        if (tab === "pending") return request.status === "PENDING"
                        if (tab === "resolved")
                          return ["APPROVED", "REJECTED", "COUNTER_NOTICE"].includes(request.status)
                        return true
                      }).length === 0 && (
                        <div className="text-center py-10">
                          <p className="text-muted-foreground">No DMCA requests found</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.status === "APPROVED" && !selectedRequest?.counter_notice_received
                ? "Record Counter Notice"
                : "Review DMCA Request"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.status === "APPROVED" && !selectedRequest?.counter_notice_received
                ? "Record a counter notice for this DMCA takedown request."
                : "Review this DMCA takedown request and decide whether to approve or reject it."}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4">
              <div className="space-y-4">
                {selectedRequest.status === "PENDING" && (
                  <>
                    <div>
                      <h3 className="font-medium">Claimant Information</h3>
                      <p className="text-sm">
                        {selectedRequest.claimant_name} ({selectedRequest.claimant_email})
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium">Content Information</h3>
                      <p className="text-sm">
                        {selectedRequest.content_type}: {selectedRequest.content_title}
                      </p>
                      <p className="text-sm">Owner: {selectedRequest.content_owner}</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Copyrighted Work</h3>
                      <div className="rounded-md bg-muted p-3">
                        <p className="text-sm">{selectedRequest.copyrighted_work}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Infringing Material</h3>
                      <div className="rounded-md bg-muted p-3">
                        <p className="text-sm">{selectedRequest.infringing_material}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label htmlFor="admin-notes" className="text-sm font-medium">
                    {selectedRequest.status === "APPROVED" && !selectedRequest.counter_notice_received
                      ? "Counter Notice Details"
                      : "Admin Notes"}
                  </label>
                  <Textarea
                    id="admin-notes"
                    placeholder={
                      selectedRequest.status === "APPROVED" && !selectedRequest.counter_notice_received
                        ? "Enter details about the counter notice..."
                        : "Enter notes about this DMCA request..."
                    }
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            {selectedRequest?.status === "APPROVED" && !selectedRequest?.counter_notice_received ? (
              <>
                <Button variant="outline" onClick={() => setReviewDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleCounterNotice} disabled={isSubmitting || !adminNotes}>
                  {isSubmitting ? "Submitting..." : "Record Counter Notice"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="destructive" onClick={() => handleReviewDMCA(false)} disabled={isSubmitting}>
                  {isSubmitting ? "Rejecting..." : "Reject"}
                </Button>
                <Button onClick={() => handleReviewDMCA(true)} disabled={isSubmitting}>
                  {isSubmitting ? "Approving..." : "Approve"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>DMCA Request Details</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Request ID</h3>
                  <p>{selectedRequest.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge
                    variant={
                      selectedRequest.status === "PENDING"
                        ? "outline"
                        : selectedRequest.status === "APPROVED"
                          ? "default"
                          : selectedRequest.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Submitted On</h3>
                  <p>{formatDate(selectedRequest.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p>{formatDate(selectedRequest.updated_at)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Claimant Information</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">{selectedRequest.claimant_name}</p>
                  <p>{selectedRequest.claimant_email}</p>
                  <p className="whitespace-pre-line text-sm">{selectedRequest.claimant_address}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Content Information</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p>
                    <span className="font-medium">Type:</span> {selectedRequest.content_type}
                  </p>
                  <p>
                    <span className="font-medium">ID:</span> {selectedRequest.content_id}
                  </p>
                  <p>
                    <span className="font-medium">Title:</span> {selectedRequest.content_title}
                  </p>
                  <p>
                    <span className="font-medium">Owner:</span> {selectedRequest.content_owner}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Copyrighted Work</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="whitespace-pre-line">{selectedRequest.copyrighted_work}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Infringing Material</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="whitespace-pre-line">{selectedRequest.infringing_material}</p>
                </div>
              </div>

              {selectedRequest.admin_notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Admin Notes</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="whitespace-pre-line">{selectedRequest.admin_notes}</p>
                  </div>
                </div>
              )}

              {selectedRequest.counter_notice_received && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Counter Notice Details</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="whitespace-pre-line">{selectedRequest.counter_notice_details}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default function DMCAManagement() {
  return (
    <AdminProtectedRoute>
      <DMCAManagementPage />
    </AdminProtectedRoute>
  )
}
