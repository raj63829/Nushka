"use client"

import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
  { name: "Products", id: "products", icon: Package },
  { name: "Orders", id: "orders", icon: ShoppingCart },
  { name: "Analytics", id: "analytics", icon: BarChart3 },
  { name: "Settings", id: "settings", icon: Settings },
]

interface AdminSidebarProps {
  onNavigate?: (page: string) => void
  currentPage?: string
}

export function AdminSidebar({ onNavigate, currentPage = "dashboard" }: AdminSidebarProps) {
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-gray-400 text-sm mt-1">Nushka Dashboard</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = currentPage === item.id
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => onNavigate?.(item.id)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
