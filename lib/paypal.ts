// PayPal client utility functions

// Initialize PayPal with your client ID
export const initPayPal = (clientId: string) => {
  // Check if client ID is provided
  if (!clientId) {
    console.error("PayPal client ID is not defined")
    return Promise.reject(new Error("PayPal client ID is not defined"))
  }

  return new Promise<void>((resolve, reject) => {
    // Rest of the function remains the same
    // Check if the script is already loaded
    if (window.paypal) {
      resolve()
      return
    }

    // Load the PayPal JS SDK script
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`
    script.async = true

    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load PayPal JS SDK"))

    document.body.appendChild(script)
  })
}

// Create a PayPal order on the server
export const createPayPalOrder = async (amount: number, description: string, metadata?: Record<string, string>) => {
  try {
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, description, metadata }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create PayPal order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    throw error
  }
}

// Capture a PayPal order after approval
export const capturePayPalOrder = async (orderId: string, metadata?: Record<string, string>) => {
  try {
    const response = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, metadata }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to capture PayPal order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error capturing PayPal order:", error)
    throw error
  }
}
