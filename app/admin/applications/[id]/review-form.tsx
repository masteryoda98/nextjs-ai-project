"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type ReviewApplicationFormProps = {
  applicationId: string
  currentStatus: string
}

export function ReviewApplicationForm({ applicationId, currentStatus }: ReviewApplicationFormProps) {
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleReview = async (status: "approved" | "rejected") => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Update the application status
      const { error } = await supabase
        .from("applications")
        .update({
          status,
          content: {
            ...((await supabase.from("applications").select("content").eq("id", applicationId).single()).data
              ?.content || {}),
            feedback,
          },
        })
        .eq("id", applicationId)

      if (error) {
        throw error
      }

      // If approved, create a submission
      if (status === "approved") {
        // Get the application data
        const { data: application, error: appError } = await supabase
          .from("applications")
          .select("*")
          .eq("id", applicationId)
          .single()

        if (appError) {
          throw appError
        }

        // Create a submission
        const { error: subError } = await supabase.from("submissions").insert([
          {
            campaign_id: application.campaign_id,
            user_id: application.user_id,
            status: "pending",
            content: application.content,
          },
        ])

        if (subError) {
          throw subError
        }
      }

      setSuccess(true)

      // Refresh the page data
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Failed to update application")
      console.error("Error updating application:", err)
    } finally {
      setLoading(false)
    }
  }

  // If already reviewed, show different UI
  if (currentStatus !== "pending") {
    return (
      <div className="w-full">
        <p className="text-sm text-gray-500 dark:text-gray-400">This application has already been {currentStatus}.</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Application status updated successfully!</AlertDescription>
        </Alert>
      )}

      <Textarea
        placeholder="Add feedback for the creator (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 bg-red-50 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
          onClick={() => handleReview("rejected")}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => handleReview("approved")}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </div>
    </div>
  )
}
