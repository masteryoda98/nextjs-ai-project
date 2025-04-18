"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { initPayPal, createPayPalOrder, capturePayPalOrder } from "@/lib/paypal"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface PayPalCheckoutButtonProps {
  amount: number
  description?: string
  metadata?: Record<string, string>
  onSuccess?: (details: any) => void
  onError?: (error: Error) => void
  onCancel?: () => void
  className?: string
}

declare global {
  interface Window {
    paypal?: any
  }
}

export function PayPalCheckoutButton({
  amount,
  description = "CreatorAmp Campaign Funding",
  metadata,
  onSuccess,
  onError,
  onCancel,
  className,
}: PayPalCheckoutButtonProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false)

  // Add retry logic and better error handling
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const paypalContainerRef = useRef<HTMLDivElement>(null)

  const initializePayPal = useCallback(async () => {
    if (retryCount >= maxRetries) {
      toast({
        title: "PayPal initialization failed",
        description: "We're having trouble connecting to PayPal. Please try again later.",
        variant: "destructive",
      })
      if (onError) onError(new Error("Failed to initialize PayPal after multiple attempts"))
      return
    }

    try {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      if (!clientId) {
        throw new Error("PayPal client ID is not defined")
      }

      await initPayPal(clientId)
      setSdkReady(true)
    } catch (error) {
      console.error(`Failed to load PayPal SDK (attempt ${retryCount + 1}/${maxRetries}):`, error)

      // Increment retry count and try again after a delay
      setRetryCount((prev) => prev + 1)
      setTimeout(() => {
        initializePayPal()
      }, 2000) // Wait 2 seconds before retrying

      if (retryCount === maxRetries - 1) {
        toast({
          title: "PayPal connection issue",
          description: "We're having trouble connecting to PayPal. Please try again later.",
          variant: "destructive",
        })
        if (onError) onError(error instanceof Error ? error : new Error(String(error)))
      }
    }
  }, [retryCount, maxRetries, onError, toast])

  // Use useEffect with the new initialization function
  useEffect(() => {
    initializePayPal()
  }, [initializePayPal])

  // Clean up PayPal script on unmount
  useEffect(() => {
    return () => {
      // Remove PayPal script if it exists
      const paypalScript = document.querySelector('script[src*="paypal.com/sdk/js"]')
      if (paypalScript) {
        paypalScript.remove()
      }

      // Clear any PayPal buttons
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = ""
      }
    }
  }, [])

  const handlePayPalButtonClick = async () => {
    if (paypalButtonRendered) {
      // If buttons are already rendered, just return
      return
    }

    setLoading(true)
    try {
      if (window.paypal) {
        const paypalButtons = window.paypal.Buttons({
          // When the button is clicked, this function creates the order
          createOrder: async () => {
            try {
              // Create order on the server
              const { id: orderId } = await createPayPalOrder(amount, description, metadata)
              return orderId
            } catch (error) {
              console.error("Error creating order:", error)
              toast({
                title: "Error",
                description: "Could not create payment. Please try again.",
                variant: "destructive",
              })
              throw error
            }
          },
          // When the buyer approves the order
          onApprove: async (data: any) => {
            try {
              // Capture the funds from the transaction
              const details = await capturePayPalOrder(data.orderID, metadata)

              toast({
                title: "Payment successful!",
                description: "Your payment has been processed successfully.",
              })

              if (onSuccess) onSuccess(details)

              return details
            } catch (error) {
              console.error("Error capturing PayPal order:", error)
              toast({
                title: "Payment failed",
                description: "There was an error processing your payment.",
                variant: "destructive",
              })

              if (onError) onError(error instanceof Error ? error : new Error(String(error)))
            }
          },
          onError: (err: Error) => {
            console.error("PayPal error:", err)
            toast({
              title: "Payment failed",
              description: "There was an error with PayPal. Please try again.",
              variant: "destructive",
            })

            if (onError) onError(err)
          },
          onCancel: () => {
            toast({
              title: "Payment cancelled",
              description: "You cancelled the payment process.",
            })

            if (onCancel) onCancel()
          },
        })

        // Clear any existing PayPal buttons
        const container = document.getElementById("paypal-button-container")
        if (container) {
          container.innerHTML = ""
          await paypalButtons.render("#paypal-button-container")
          setPaypalButtonRendered(true)
        }
      }
    } catch (error) {
      console.error("Error setting up PayPal payment:", error)
      toast({
        title: "Payment setup failed",
        description: "There was an error setting up the payment. Please try again.",
        variant: "destructive",
      })

      if (onError) onError(error instanceof Error ? error : new Error(String(error)))
    } finally {
      setLoading(false)
    }
  }

  // Update the render function to use the ref
  return (
    <div className={className}>
      {sdkReady ? (
        <>
          <Button onClick={handlePayPalButtonClick} disabled={loading || paypalButtonRendered} className="w-full mb-4">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up payment...
              </>
            ) : paypalButtonRendered ? (
              "Choose payment method below"
            ) : (
              "Pay with PayPal"
            )}
          </Button>
          <div id="paypal-button-container" ref={paypalContainerRef} className="min-h-[150px]"></div>
        </>
      ) : (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {retryCount > 0 ? `Connecting to PayPal (attempt ${retryCount}/${maxRetries})...` : "Loading PayPal..."}
        </Button>
      )}
    </div>
  )
}
