const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body || "{}");

    if (!email) return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };

    // Trigger Magic Link login
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email
    });

    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };

    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
