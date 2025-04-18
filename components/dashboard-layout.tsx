"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Music, Users, FileText, DollarSign, Settings, LogOut, Bell } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "artist" | "creator" | "admin"
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const pathname = usePathname()

  // Navigation links based on user type
  const getNavLinks = () => {
    const baseLinks = [
      {
        href: `/dashboard/${userType}`,
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: `/dashboard/${userType}/campaigns`,
        label: "Campaigns",
        icon: Music,
      },
    ]

    if (userType === "artist") {
      return [
        ...baseLinks,
        {
          href: `/dashboard/${userType}/submissions`,
          label: "Submissions",
          icon: FileText,
        },
        {
          href: `/dashboard/${userType}/finance`,
          label: "Finance",
          icon: DollarSign,
        },
        {
          href: `/dashboard/${userType}/settings`,
          label: "Settings",
          icon: Settings,
        },
      ]
    }

    if (userType === "creator") {
      return [
        ...baseLinks,
        {
          href: `/dashboard/${userType}/submissions`,
          label: "My Submissions",
          icon: FileText,
        },
        {
          href: `/dashboard/${userType}/earnings`,
          label: "Earnings",
          icon: DollarSign,
        },
        {
          href: `/dashboard/${userType}/settings`,
          label: "Settings",
          icon: Settings,
        },
      ]
    }

    // Admin links
    return [
      ...baseLinks,
      {
        href: `/dashboard/${userType}/users`,
        label: "Users",
        icon: Users,
      },
      {
        href: `/dashboard/${userType}/submissions`,
        label: "Submissions",
        icon: FileText,
      },
      {
        href: `/dashboard/${userType}/finance`,
        label: "Finance",
        icon: DollarSign,
      },
      {
        href: `/dashboard/${userType}/settings`,
        label: "Settings",
        icon: Settings,
      },
    ]
  }

  const navLinks = getNavLinks()

  // User display name based on user type
  const userName = userType === "artist" ? "Artist Name" : userType === "creator" ? "Creator Name" : "Admin User"

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            CreatorAmp
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === link.href ? "bg-accent text-accent-foreground" : "",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User profile" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span>{userName}</span>
              <span className="text-xs text-muted-foreground capitalize">{userType}</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" asChild>
              <Link href="/api/auth/signout">
                <LogOut className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="md:hidden">{/* Mobile menu button would go here */}</div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>

            <div className="md:hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User profile" />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
