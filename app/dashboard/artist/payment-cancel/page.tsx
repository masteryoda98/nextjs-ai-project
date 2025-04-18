"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { XCircle } from "lucide-react"

import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function PaymentCancelPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title: "Payment cancelled",
      description: "Your payment was cancelled. Your campaign has not been created.",
      variant: "destructive",
    })
  }, [toast])

  return (
    <DashboardLayout userType="artist">
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-center text-2xl">Payment Cancelled</CardTitle>
            <CardDescription className="text-center">
              Your payment was cancelled and your campaign has not been created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              You can try again or make changes to your campaign before funding it.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/artist">Return to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/artist/create-campaign">Try Again</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
