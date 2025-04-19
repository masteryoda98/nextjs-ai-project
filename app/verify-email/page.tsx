"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token")
      const type = searchParams.get("type")

      if (token && type === "signup") {
        setIsVerifying(true)
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "signup",
          })

          if (error) {
            setError(error.message)
          } else {
            setIsVerified(true)
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push("/dashboard/creator")
            }, 3000)
          }
        } catch (err) {
          setError("An unexpected error occurred. Please try again.")
        } finally {
          setIsVerifying(false)
        }
      }
    }

    verifyEmail()
  }, [searchParams, router, supabase.auth])

  return (
    <div className="container flex h-screen items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Verify your email address to complete your registration</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
          {isVerifying ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Verifying your email...</p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p>Your email has been verified successfully!</p>
              <p className="text-sm text-muted-foreground">Redirecting you to the dashboard...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <p className="text-destructive">{error}</p>
              <p>Please try again or contact support if the problem persists.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p>Please check your email for a verification link.</p>
              <p className="text-sm text-muted-foreground">
                If you haven't received an email, please check your spam folder or request a new verification email.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isVerifying && !isVerified && (
            <Button asChild variant="outline">
              <Link href="/login">Back to Login</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
