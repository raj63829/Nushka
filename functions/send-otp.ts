import type { Handler } from "@netlify/functions"
import fetch from "node-fetch"

export const handler: Handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body || "{}")
    if (!email) return { statusCode: 400, body: JSON.stringify({ error: "Email required" }) }

    // Call your actual backend HTTP endpoint
    const response = await fetch("http://casper-ai-573fqmg7wa-uc.a.run.app/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data?.error || "Failed to send OTP")

    return { statusCode: 200, body: JSON.stringify({ success: true, data }) }
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) }
  }
}
