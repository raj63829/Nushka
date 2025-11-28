import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

interface AuthCallbackProps {
  onPageChange: (page: string) => void
}

export default function AuthCallback({ onPageChange }: AuthCallbackProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // ✅ Exchange code for session (for magic link or OAuth)
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)

        if (error) {
          console.error("Auth callback error:", error.message)
          setError(error.message)
          return
        }

        if (data?.session) {
          // ✅ Auth success
          console.log("User authenticated:", data.session.user)
          onPageChange("home")
        } else {
          setError("No active session found.")
          onPageChange("auth")
        }
      } catch (err: any) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [onPageChange])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => onPageChange("auth")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return null
}
