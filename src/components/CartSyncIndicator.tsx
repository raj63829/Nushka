"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Cloud, CloudOff, RefreshCw, Check } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

const CartSyncIndicator: React.FC = () => {
  const { state, syncCart } = useCart()
  const { state: authState } = useAuth()
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline" | "error">("synced")
  const [lastSyncText, setLastSyncText] = useState("")

  useEffect(() => {
    if (state.isLoading) {
      setSyncStatus("syncing")
    } else if (state.lastSyncTime) {
      setSyncStatus("synced")
      updateLastSyncText()
    } else {
      setSyncStatus("offline")
    }
  }, [state.isLoading, state.lastSyncTime])

  const updateLastSyncText = () => {
    if (!state.lastSyncTime) return

    const now = Date.now()
    const diff = now - state.lastSyncTime
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) {
      setLastSyncText("Just now")
    } else if (minutes < 60) {
      setLastSyncText(`${minutes}m ago`)
    } else {
      const hours = Math.floor(minutes / 60)
      setLastSyncText(`${hours}h ago`)
    }
  }

  const handleManualSync = async () => {
    setSyncStatus("syncing")
    try {
      await syncCart()
      setSyncStatus("synced")
    } catch (error) {
      setSyncStatus("error")
    }
  }

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RefreshCw className="h-3 w-3 animate-spin" />
      case "synced":
        return <Check className="h-3 w-3" />
      case "offline":
        return <CloudOff className="h-3 w-3" />
      case "error":
        return <CloudOff className="h-3 w-3 text-red-500" />
      default:
        return <Cloud className="h-3 w-3" />
    }
  }

  const getStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Syncing..."
      case "synced":
        return authState.isAuthenticated ? `Synced ${lastSyncText}` : "Saved locally"
      case "offline":
        return "Offline"
      case "error":
        return "Sync failed"
      default:
        return "Unknown"
    }
  }

  const getStatusColor = () => {
    switch (syncStatus) {
      case "syncing":
        return "text-blue-600"
      case "synced":
        return "text-green-600"
      case "offline":
        return "text-sage-600"
      case "error":
        return "text-red-600"
      default:
        return "text-sage-600"
    }
  }

  // Don't show for empty carts
  if (state.itemCount === 0) return null

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {(syncStatus === "error" || syncStatus === "offline") && (
        <button
          onClick={handleManualSync}
          disabled={syncStatus === "syncing"}
          className="text-sage-600 hover:text-sage-800 underline disabled:opacity-50"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default CartSyncIndicator
