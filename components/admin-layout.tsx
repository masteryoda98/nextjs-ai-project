"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background">
      <nav className="hidden md:flex w-64 flex-col border-r" aria-label="Main Navigation">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2" aria-label="CreatorAmp Home">
            CreatorAmp Admin
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <ul className="grid items-start px-2 text-sm font-medium">
            <li>
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === "/admin" ? "bg-accent text-accent-foreground" : "",
                )}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/campaigns"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === "/admin/campaigns" ? "bg-accent text-accent-foreground" : "",
                )}
              >
                Campaigns
              </Link>
            </li>
            <li>
              <Link
                href="/admin/submissions"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === "/admin/submissions" ? "bg-accent text-accent-foreground" : "",
                )}
              >
                Submissions
              </Link>
            </li>
            <li>
              <Link
                href="/admin/applications"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === "/admin/applications" ? "bg-accent text-accent-foreground" : "",
                )}
              >
                Applications
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === "/admin/users" ? "bg-accent text-accent-foreground" : "",
                )}
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/analytics"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === "/admin/analytics" ? "bg-accent text-accent-foreground" : "",
                )}
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link
                href="/admin/payouts"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === "/admin/payouts" ? "bg-accent text-accent-foreground" : "",
                )}
              >
                Payouts
              </Link>
            </li>
            <li>
              <Link
                href="/admin/dmca"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                  pathname === "/admin/dmca" ? "bg-accent text-accent-foreground" : "",
                )}
              >
                DMCA Requests
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="w-full flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin profile" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
              <span>Admin User</span>
              <span className="text-xs text-muted-foreground">Administrator</span>
            </div>
            <Link href="/logout" className="ml-auto">
              <Button variant="ghost" size="icon" aria-label="Sign out">
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-4 lg:p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
