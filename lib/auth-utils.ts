// This file contains utilities that can be used in Client Components

import { createClient } from "./supabase/client"

// Check if user is authenticated (client-side)
export async function isAuthenticated() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return !!session
}

// Get the current user (client-side)
export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user || null
}

// Get user role (client-side)
export async function getUserRole() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  try {
    const { data, error } = await supabase.from("creatoramp_users").select("role").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user role:", error)
      return null
    }

    return data?.role || null
  } catch (error) {
    console.error("Error in getUserRole:", error)
    return null
  }
}

// Check if user has admin role (client-side)
export async function isAdmin() {
  try {
    const role = await getUserRole()
    return role === "ADMIN"
  } catch (error) {
    console.error("Error in isAdmin check:", error)
    return false
  }
}

// Check if user has artist role (client-side)
export async function isArtist() {
  const role = await getUserRole()
  return role === "ARTIST"
}

// Check if user has creator role (client-side)
export async function isCreator() {
  const role = await getUserRole()
  return role === "CREATOR"
}
