import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import type { Database } from "@/types/database"

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated() {
  const supabase = createClientComponentClient<Database>()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return !!session
}

/**
 * Get the user's role
 */
export async function getUserRole() {
  const supabase = createClientComponentClient<Database>()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return session.user?.user_metadata?.role || null
}

/**
 * Check if the user is an admin
 */
export async function isAdmin() {
  const role = await getUserRole()
  return role === "ADMIN"
}

/**
 * Check if the user is an artist
 */
export async function isArtist() {
  const role = await getUserRole()
  return role === "ARTIST"
}

/**
 * Check if the user is a creator
 */
export function isCreator() {
  const supabase = createClientComponentClient<Database>()
  const {
    data: { session },
  } = supabase.auth.getSession()

  if (!session) {
    return false
  }

  return session.user?.user_metadata?.role === "CREATOR"
}

/**
 * Redirect if the user is not authenticated
 */
export function redirectIfNotAuthenticated() {
  const supabase = createClientComponentClient<Database>()
  const {
    data: { session },
  } = supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }
}

/**
 * Redirect if the user is not an admin
 */
export function redirectIfNotAdmin() {
  const supabase = createClientComponentClient<Database>()
  const {
    data: { session },
  } = supabase.auth.getSession()

  if (!session || session.user?.user_metadata?.role !== "ADMIN") {
    redirect("/login")
  }
}
