"use client"
import type { Submission } from "@/lib/submission-utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SubmissionCardProps {
  submission: Submission
  onReview: (submission: Submission) => void
}

export function SubmissionCard({ submission, onReview }: SubmissionCardProps) {
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

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return dateString
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{submission.creator.tiktokHandle}</CardTitle>
            <CardDescription>Submitted {formatDate(submission.submittedAt)}</CardDescription>
          </div>
          {getStatusBadge(submission.status)}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div>
            <p className="font-medium">Campaign</p>
            <p className="text-sm text-muted-foreground">{submission.campaign.name}</p>
          </div>

          <div>
            <p className="font-medium">Content Type</p>
            <p className="text-sm text-muted-foreground">{submission.campaign.contentType.replace("_", " ")}</p>
          </div>

          {submission.caption && (
            <div>
              <p className="font-medium">Caption</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{submission.caption}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
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
          <Button size="sm" className="flex-1" onClick={() => onReview(submission)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Review
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
