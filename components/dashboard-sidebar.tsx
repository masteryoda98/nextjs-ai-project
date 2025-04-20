"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Music, Users, FileText, DollarSign, Settings } from "lucide-react"

import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  userType: "artist" | "creator" | "admin"
}

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
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

  return (
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
    </div>
  )
}
