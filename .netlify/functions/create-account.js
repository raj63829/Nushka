require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use SERVICE ROLE key for admin tasks (creating users)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { firstName, lastName, email, password } = JSON.parse(event.body || '{}');

    if (!firstName || !lastName || !email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'All fields are required.' }) };
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { firstName, lastName },
      email_confirm: true,
    });

    if (error) {
      return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Account created successfully', user: data.user }),
    };
  } catch (err) {
    console.error('Create Account Error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
