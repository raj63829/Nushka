require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use ANON key for user login
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email and password are required.' }) };
    }

    // Correct way to sign in a user
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful',
        user: data.user,
        session: data.session,
      }),
    };
  } catch (err) {
    console.error('Login Error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Login failed' }) };
  }
};
