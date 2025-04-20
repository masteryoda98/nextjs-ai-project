"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Home, Users, FileText, DollarSign, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/database"

type UserRole = "ADMIN" | "ARTIST" | "CREATOR" | null

export function DashboardSidebar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function getUserRole() {
      const supabase = createClientComponentClient<Database>()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setUserRole((session.user?.user_metadata?.role as UserRole) || null)
      }
    }

    getUserRole()
  }, [])

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/campaigns", label: "Campaigns", icon: FileText },
    { href: "/admin/submissions", label: "Submissions", icon: FileText },
    { href: "/admin/applications", label: "Applications", icon: Users },
    { href: "/admin/payouts", label: "Payouts", icon: DollarSign },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const artistLinks = [
    { href: "/dashboard/artist", label: "Dashboard", icon: Home },
    { href: "/dashboard/artist/campaigns", label: "Campaigns", icon: FileText },
    { href: "/dashboard/artist/submissions", label: "Submissions", icon: FileText },
    { href: "/dashboard/artist/finance", label: "Finance", icon: DollarSign },
    { href: "/dashboard/artist/settings", label: "Settings", icon: Settings },
  ]

  const creatorLinks = [
    { href: "/dashboard/creator", label: "Dashboard", icon: Home },
    { href: "/dashboard/creator/campaigns", label: "Campaigns", icon: FileText },
    { href: "/dashboard/creator/submissions", label: "Submissions", icon: FileText },
    { href: "/dashboard/creator/earnings", label: "Earnings", icon: DollarSign },
    { href: "/dashboard/creator/settings", label: "Settings", icon: Settings },
  ]

  let links = []

  if (userRole === "ADMIN") {
    links = adminLinks
  } else if (userRole === "ARTIST") {
    links = artistLinks
  } else if (userRole === "CREATOR") {
    links = creatorLinks
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className="md:hidden p-4">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className={`fixed inset-0 z-50 bg-background md:static md:block ${isOpen ? "block" : "hidden"}`}>
        <div className="flex h-screen flex-col gap-2 p-4 md:h-full">
          <div className="flex justify-between items-center md:hidden">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <Button variant="outline" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t pt-4">
            <Link
              href="/auth/logout"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
