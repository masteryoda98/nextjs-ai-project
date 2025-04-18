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

type ContentItem = {
  id: number
  type: "SUBMISSION" | "CAMPAIGN" | "PROFILE"
  title: string
  description?: string
  contentUrl?: string
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "FLAGGED"
  createdAt: string
  creatorName?: string
  creatorId?: string
  campaignId?: number
  campaignName?: string
}

export default function ContentModerationPage() {
  const { toast } = useToast()
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  useEffect(() => {
    fetchContentItems()
  }, [])

  const fetchContentItems = async () => {
    setLoading(true)
    try {
      // Fetch submissions that need moderation
      const { data: submissions, error: submissionsError } = await supabase
        .from("submissions")
        .select(`
          id,
          content_url,
          caption,
          status,
          submitted_at,
          creator_id,
          campaign_id,
          creatoramp_users(name),
          campaigns(name)
        `)
        .in("status", ["PENDING_REVIEW", "FLAGGED"])
        .order("submitted_at", { ascending: false })

      if (submissionsError) throw submissionsError

      // Fetch campaigns that need moderation
      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select(`
          id,
          name,
          description,
          status,
          created_at,
          artist_id,
          creatoramp_users(name)
        `)
        .in("status", ["PENDING_REVIEW", "FLAGGED"])
        .order("created_at", { ascending: false })

      if (campaignsError) throw campaignsError

      // Combine and format the data
      const formattedSubmissions = submissions.map((submission) => ({
        id: submission.id,
        type: "SUBMISSION" as const,
        title: submission.caption || "Untitled Submission",
        description: submission.caption,
        contentUrl: submission.content_url,
        status: submission.status as "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "FLAGGED",
        createdAt: submission.submitted_at,
        creatorName: submission.creatoramp_users?.name,
        creatorId: submission.creator_id,
        campaignId: submission.campaign_id,
        campaignName: submission.campaigns?.name,
      }))

      const formattedCampaigns = campaigns.map((campaign) => ({
        id: campaign.id,
        type: "CAMPAIGN" as const,
        title: campaign.name,
        description: campaign.description,
        status: campaign.status as "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "FLAGGED",
        createdAt: campaign.created_at,
        creatorName: campaign.creatoramp_users?.name,
        creatorId: campaign.artist_id,
      }))

      setContentItems([...formattedSubmissions, ...formattedCampaigns])
    } catch (error) {
      console.error("Error fetching content items:", error)
      toast({
        title: "Error",
        description: "Failed to fetch content items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReviewContent = async (approved: boolean) => {
    if (!selectedItem) return

    setIsSubmitting(true)
    try {
      if (selectedItem.type === "SUBMISSION") {
        const { error } = await supabase
          .from("submissions")
          .update({
            status: approved ? "APPROVED" : "REJECTED",
            revision_notes: approved ? null : reviewNotes,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", selectedItem.id)

        if (error) throw error
      } else if (selectedItem.type === "CAMPAIGN") {
        const { error } = await supabase
          .from("campaigns")
          .update({
            status: approved ? "ACTIVE" : "REJECTED",
            review_notes: approved ? null : reviewNotes,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", selectedItem.id)

        if (error) throw error
      }

      toast({
        title: approved ? "Content Approved" : "Content Rejected",
        description: `The ${selectedItem.type.toLowerCase()} has been ${
          approved ? "approved" : "rejected"
        } successfully.`,
      })

      // Update local state
      setContentItems(contentItems.filter((item) => item.id !== selectedItem.id || item.type !== selectedItem.type))

      setReviewDialogOpen(false)
      setReviewNotes("")
    } catch (error) {
      console.error("Error reviewing content:", error)
      toast({
        title: "Error",
        description: "Failed to review content",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredItems = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.creatorName && item.creatorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.campaignName && item.campaignName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || item.type === typeFilter

    return matchesSearch && matchesType
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
          <h1 className="text-2xl font-bold tracking-tight">Content Moderation</h1>
          <Button onClick={fetchContentItems} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contentItems.filter((item) => item.status === "PENDING_REVIEW").length}
              </div>
              <p className="text-xs text-muted-foreground">Items awaiting moderation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contentItems.filter((item) => item.status === "FLAGGED").length}
              </div>
              <p className="text-xs text-muted-foreground">Items flagged for review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contentItems.filter((item) => item.type === "SUBMISSION").length}
              </div>
              <p className="text-xs text-muted-foreground">Creator submissions pending review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentItems.filter((item) => item.type === "CAMPAIGN").length}</div>
              <p className="text-xs text-muted-foreground">Artist campaigns pending review</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search content, creators, or campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="SUBMISSION">Submissions</SelectItem>
                <SelectItem value="CAMPAIGN">Campaigns</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>

          {["all", "pending", "flagged"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tab === "all" ? "All Content" : tab === "pending" ? "Pending Review" : "Flagged Content"}
                  </CardTitle>
                  <CardDescription>
                    {
                      filteredItems.filter((item) => {
                        if (tab === "pending") return item.status === "PENDING_REVIEW"
                        if (tab === "flagged") return item.status === "FLAGGED"
                        return true
                      }).length
                    }{" "}
                    items found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <p>Loading content...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredItems
                        .filter((item) => {
                          if (tab === "pending") return item.status === "PENDING_REVIEW"
                          if (tab === "flagged") return item.status === "FLAGGED"
                          return true
                        })
                        .map((item) => (
                          <div
                            key={`${item.type}-${item.id}`}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  item.type === "SUBMISSION"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-purple-100 text-purple-600"
                                }`}
                              >
                                {item.type === "SUBMISSION" ? (
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
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" />
                                    <path d="M7 10L12 15L17 10" />
                                    <path d="M12 15V3" />
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
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{formatDate(item.createdAt)}</span>
                                  <span>•</span>
                                  <span>
                                    {item.type === "SUBMISSION" ? "Submission" : "Campaign"} by {item.creatorName}
                                  </span>
                                  {item.campaignName && (
                                    <>
                                      <span>•</span>
                                      <span>{item.campaignName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  item.status === "PENDING_REVIEW"
                                    ? "outline"
                                    : item.status === "FLAGGED"
                                      ? "destructive"
                                      : "default"
                                }
                              >
                                {item.status === "PENDING_REVIEW" ? "Pending" : "Flagged"}
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
                                  {item.contentUrl && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedItem(item)
                                        setPreviewDialogOpen(true)
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Preview Content
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedItem(item)
                                      setReviewDialogOpen(true)
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Review
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}

                      {filteredItems.filter((item) => {
                        if (tab === "pending") return item.status === "PENDING_REVIEW"
                        if (tab === "flagged") return item.status === "FLAGGED"
                        return true
                      }).length === 0 && (
                        <div className="text-center py-10">
                          <p className="text-muted-foreground">No content items found</p>
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
            <DialogTitle>Review Content</DialogTitle>
            <DialogDescription>
              {selectedItem?.type === "SUBMISSION"
                ? "Review this submission before it's published on TikTok."
                : "Review this campaign before it's made available to creators."}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedItem.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.type === "SUBMISSION" ? "Submitted by" : "Created by"}: {selectedItem.creatorName}
                  </p>
                </div>

                {selectedItem.description && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm">{selectedItem.description}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="review-notes" className="text-sm font-medium">
                    Review Notes (required if rejecting)
                  </label>
                  <Textarea
                    id="review-notes"
                    placeholder="Enter notes about why this content is being rejected..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => handleReviewContent(false)}
              disabled={isSubmitting || (!reviewNotes && selectedItem?.status !== "FLAGGED")}
            >
              {isSubmitting ? "Rejecting..." : "Reject"}
            </Button>
            <Button onClick={() => handleReviewContent(true)} disabled={isSubmitting}>
              {isSubmitting ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
          </DialogHeader>

          {selectedItem && selectedItem.contentUrl && (
            <div className="py-4">
              <div className="aspect-video rounded-md overflow-hidden bg-black">
                {selectedItem.contentUrl.includes("youtube") || selectedItem.contentUrl.includes("youtu.be") ? (
                  <iframe
                    src={selectedItem.contentUrl.replace("watch?v=", "embed/")}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                ) : selectedItem.contentUrl.includes(".mp4") || selectedItem.contentUrl.includes(".mov") ? (
                  <video src={selectedItem.contentUrl} controls className="w-full h-full"></video>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white">Preview not available</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="font-medium">{selectedItem.title}</h3>
                {selectedItem.description && <p className="text-sm mt-2">{selectedItem.description}</p>}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setPreviewDialogOpen(false)
                setSelectedItem(selectedItem)
                setReviewDialogOpen(true)
              }}
            >
              Review Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
