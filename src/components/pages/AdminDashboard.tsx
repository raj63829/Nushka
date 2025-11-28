"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminSidebar } from "../admin/AdminSidebar"
import { DashboardHeader } from "../admin/DashboardHeader"
import { AdminStats } from "../admin/AdminStats"
import { useAdmin } from "../../context/AdminContext"
import { useAuth } from "../../context/AuthContext"

interface AdminDashboardProps {
  children?: React.ReactNode
  onPageChange?: (page: string) => void
}

export default function AdminDashboard({ children, onPageChange }: AdminDashboardProps) {
  const { isAdmin, isLoading } = useAdmin()
  const { user } = useAuth()
  const [currentAdminPage, setCurrentAdminPage] = useState("dashboard")

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      // Redirect to login if not admin
      if (onPageChange) {
        onPageChange("auth")
      }
    }
  }, [isAdmin, isLoading, user, onPageChange])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <button
            onClick={() => onPageChange?.("auth")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const handleAdminNavigation = (page: string) => {
    setCurrentAdminPage(page)
    if (onPageChange) {
      if (page === "products") {
        onPageChange("admin-products")
      } else if (page === "orders") {
        onPageChange("admin-orders")
      } else {
        onPageChange("admin")
      }
    }
  }

  const isDashboardHome = !children

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onNavigate={handleAdminNavigation} currentPage={currentAdminPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {isDashboardHome && <AdminStats />}
          {children}
        </main>
      </div>
    </div>
  )
}
