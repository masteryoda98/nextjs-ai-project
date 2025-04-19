"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const verifyEmail = async () => {
      // Check if we have a code and type in the URL
      const code = searchParams.get("code")
      const type = searchParams.get("type")

      if (code && type === "signup") {
        setIsVerifying(true)
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: "signup",
          })

          if (error) {
            setVerificationStatus("error")
            setErrorMessage(error.message)
          } else {
            setVerificationStatus("success")
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push("/dashboard/creator")
            }, 3000)
          }
        } catch (error) {
          setVerificationStatus("error")
          setErrorMessage("An unexpected error occurred during verification.")
        } finally {
          setIsVerifying(false)
        }
      }
    }

    verifyEmail()
  }, [searchParams, supabase.auth, router])

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>

          {isVerifying ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verifying your email...</p>
            </div>
          ) : verificationStatus === "success" ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="space-y-2">
                <p className="text-sm">Your email has been verified successfully!</p>
                <p className="text-sm text-muted-foreground">Redirecting you to the dashboard...</p>
              </div>
            </div>
          ) : verificationStatus === "error" ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-sm">There was a problem verifying your email.</p>
                <p className="text-sm text-red-600">{errorMessage}</p>
                <p className="text-sm text-muted-foreground">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-8">
              <p className="text-sm text-muted-foreground">
                We've sent a verification link to your email address. Please check your inbox and click the link to
                verify your account.
              </p>
              <p className="text-sm text-muted-foreground">
                If you don't see the email, check your spam folder or{" "}
                <Link href="/signup" className="text-primary underline underline-offset-4">
                  try signing up again
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
