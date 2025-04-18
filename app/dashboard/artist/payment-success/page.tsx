"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const orderId = searchParams.get("token") || searchParams.get("paymentId")

  useEffect(() => {
    // Show success toast
    toast({
      title: "Payment successful!",
      description: "Your campaign has been funded successfully.",
    })
  }, [toast])

  return (
    <DashboardLayout userType="artist">
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">Payment Successful!</CardTitle>
            <CardDescription className="text-center">
              Your campaign has been created and funded successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                <span className="font-medium">Order ID:</span> {orderId || "N/A"}
              </p>
              <p className="text-sm mt-2">
                Your campaign is now live and available for creators to apply. You'll receive notifications as creators
                submit content for your review.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard/artist/campaigns">View My Campaigns</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
