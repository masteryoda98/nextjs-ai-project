"use client"

import { useState } from "react"
import { type Submission, reviewSubmission } from "@/lib/submission-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface ReviewDialogProps {
  submission: Submission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReviewComplete: () => void
}

export function ReviewDialog({ submission, open, onOpenChange, onReviewComplete }: ReviewDialogProps) {
  const { toast } = useToast()
  const [reviewNotes, setReviewNotes] = useState("")
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "NEEDS_REVISION" | "REJECTED" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReviewSubmit = async () => {
    if (!submission || !reviewAction) return

    setIsSubmitting(true)
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

      const result = await reviewSubmission({
        submissionId: Number(submission.id),
        status: reviewAction,
        revisionNotes: reviewNotes,
        reviewerId: user.id,
        feedback: reviewNotes,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: `Submission ${reviewAction.toLowerCase()} successfully`,
        })
        onOpenChange(false)
        onReviewComplete()
      } else {
        toast({
          title: "Error",
          description: "Failed to review submission",
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
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Submission</DialogTitle>
          <DialogDescription>
            Review the content submitted by {submission?.creator.tiktokHandle} for the campaign "
            {submission?.campaign.name}".
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReviewSubmit} disabled={!reviewAction || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
