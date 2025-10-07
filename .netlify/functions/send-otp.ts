// functions/send-otp.js
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service role key on server-side only
)

export async function handler(event, context) {
  try {
    const { email } = JSON.parse(event.body || "{}")

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) }
    }

    // Create or trigger OTP login
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true
    })

    if (error) {
      return { statusCode: 400, body: JSON.stringify({ error: error.message }) }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, data }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
