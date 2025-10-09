"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"

interface AdminContextType {
  isAdmin: boolean
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isLoading: true,
})

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    // Check if user has admin role
    // Since we're using mock auth, we'll check for specific admin emails
    const adminEmails = ["admin@nushka.com", "admin@example.com"]

    if (user) {
      const userIsAdmin = adminEmails.includes(user.email) || user.role === "admin"
      setIsAdmin(userIsAdmin)
    } else {
      setIsAdmin(false)
    }

    setIsLoading(false)
  }, [user])

  return <AdminContext.Provider value={{ isAdmin, isLoading }}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
