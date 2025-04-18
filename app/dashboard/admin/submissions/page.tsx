"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Eye, MessageSquare, Clock, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

type Submission = {
  id: string
  status: string
  contentUrl: string
  caption: string | null
  submittedAt: string
  campaign: {
    name: string
    contentType: string
  }
  creator: {
    name: string
    tiktokHandle: string
  }
}

export default function AdminSubmissionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "NEEDS_REVISION" | "REJECTED" | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/submissions")
      const data = await response.json()

      if (data.success) {
        setSubmissions(data.submissions)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch submissions",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async () => {
    if (!selectedSubmission || !reviewAction) return

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to review submissions",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/submissions/${selectedSubmission.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: reviewAction,
          revisionNotes: reviewNotes,
          reviewerId: user.id,
          feedback: reviewNotes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        setReviewDialogOpen(false)
        fetchSubmissions()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to review submission",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return <Badge className="bg-amber-500">Pending Review</Badge>
      case "NEEDS_REVISION":
        return <Badge className="bg-blue-500">Needs Revision</Badge>
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>
      case "REJECTED":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "PUBLISHED":
        return <Badge className="bg-purple-500">Published</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const openReviewDialog = (submission: Submission) => {
    setSelectedSubmission(submission)
    setReviewNotes("")
    setReviewAction(null)
    setReviewDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Submission Management</h1>
        <Button onClick={fetchSubmissions} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review
            <Badge variant="outline" className="ml-2">
              {submissions.filter((s) => s.status === "PENDING_REVIEW").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="revision">
            Needs Revision
            <Badge variant="outline" className="ml-2">
              {submissions.filter((s) => s.status === "NEEDS_REVISION").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Badge variant="outline" className="ml-2">
              {submissions.filter((s) => s.status === "APPROVED").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
        </TabsList>

        {["pending", "revision", "approved", "all"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <p>Loading submissions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {submissions
                  .filter((submission) => {
                    if (tab === "pending") return submission.status === "PENDING_REVIEW"
                    if (tab === "revision") return submission.status === "NEEDS_REVISION"
                    if (tab === "approved") return submission.status === "APPROVED" || submission.status === "PUBLISHED"
                    return true // "all" tab
                  })
                  .map((submission) => (
                    <Card key={submission.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{submission.creator.tiktokHandle}</CardTitle>
                            <CardDescription>{new Date(submission.submittedAt).toLocaleDateString()}</CardDescription>
                          </div>
                          {getStatusBadge(submission.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium">Campaign</p>
                            <p className="text-sm text-muted-foreground">{submission.campaign.name}</p>
                          </div>

                          <div>
                            <p className="font-medium">Content Type</p>
                            <p className="text-sm text-muted-foreground">
                              {submission.campaign.contentType.replace("_", " ")}
                            </p>
                          </div>

                          {submission.caption && (
                            <div>
                              <p className="font-medium">Caption</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">{submission.caption}</p>
                            </div>
                          )}

                          <div className="pt-2 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => window.open(submission.contentUrl, "_blank")}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Content
                            </Button>

                            {submission.status === "PENDING_REVIEW" && (
                              <Button size="sm" className="flex-1" onClick={() => openReviewDialog(submission)}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {!loading &&
              submissions.filter((submission) => {
                if (tab === "pending") return submission.status === "PENDING_REVIEW"
                if (tab === "revision") return submission.status === "NEEDS_REVISION"
                if (tab === "approved") return submission.status === "APPROVED" || submission.status === "PUBLISHED"
                return true // "all" tab
              }).length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No submissions found</p>
                </div>
              )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              Review the content submitted by {selectedSubmission?.creator.tiktokHandle} for the campaign "
              {selectedSubmission?.campaign.name}".
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Feedback / Revision Notes</label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Provide feedback or revision instructions..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Review Decision</label>
              <div className="flex gap-2">
                <Button
                  variant={reviewAction === "APPROVED" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setReviewAction("APPROVED")}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant={reviewAction === "NEEDS_REVISION" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setReviewAction("NEEDS_REVISION")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Request Revision
                </Button>
                <Button
                  variant={reviewAction === "REJECTED" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setReviewAction("REJECTED")}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReviewSubmit} disabled={!reviewAction}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
