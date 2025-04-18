"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getUserRole } from "@/lib/auth-utils"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "ADMIN" | "ARTIST" | "CREATOR"
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const authenticated = await isAuthenticated()

        if (!authenticated) {
          router.push("/login")
          return
        }

        if (requiredRole) {
          const role = await getUserRole()
          if (role !== requiredRole) {
            router.push("/dashboard")
            return
          }
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredRole])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return isAuthorized ? <>{children}</> : null
}
