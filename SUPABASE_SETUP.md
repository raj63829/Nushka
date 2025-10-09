# Supabase Setup Guide for Nushka E-commerce

This guide will help you set up Supabase authentication and database for your Nushka e-commerce application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `nushka-ecommerce`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon public key

## 3. Set Up Environment Variables

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholders with your actual values from step 2.

## 4. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `scripts/01-create-database-schema.sql`
3. Run the SQL script to create all necessary tables

## 5. Configure Authentication

### Enable Google OAuth (for Gmail authentication)

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Google provider
3. You'll need to set up Google OAuth credentials:

#### Setting up Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy the Client ID and Client Secret
8. Add them to Supabase Authentication → Providers → Google

### Configure Email Authentication

1. Go to Authentication → Settings
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add redirect URLs:
   - `http://localhost:5173/auth-callback` (for development)
   - `https://yourdomain.com/auth-callback` (for production)

## 6. Set Up Row Level Security (RLS)

The database schema includes RLS policies, but you may need to verify they're active:

1. Go to Authentication → Policies
2. Ensure all tables have RLS enabled
3. Verify the policies are correctly set up

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Try to sign up with email/password
3. Try Google OAuth login
4. Check that user profiles are created in the database

## 8. Production Deployment

### For Netlify (recommended):

1. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Update redirect URLs in Supabase:
   - Add your production domain to allowed redirect URLs
   - Update site URL to your production domain

### For other platforms:

1. Set the environment variables in your hosting platform
2. Update redirect URLs in Supabase authentication settings

## 9. Database Management

### Viewing Data:
- Go to Table Editor in Supabase dashboard
- You can view and manage all your data there

### Backing Up:
- Supabase automatically backs up your database
- You can also export data from the dashboard

## 10. Troubleshooting

### Common Issues:

1. **Authentication not working:**
   - Check environment variables are set correctly
   - Verify redirect URLs match exactly
   - Check browser console for errors

2. **Database errors:**
   - Ensure RLS policies are set up correctly
   - Check that the schema was created successfully
   - Verify user permissions

3. **Google OAuth issues:**
   - Verify Google OAuth credentials are correct
   - Check that redirect URIs match exactly
   - Ensure Google+ API is enabled

### Getting Help:
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Join Supabase Discord community
- Check the project's GitHub issues

## 11. Security Best Practices

1. **Never expose your service role key** in client-side code
2. **Use RLS policies** to secure your data
3. **Regularly rotate** your API keys
4. **Monitor** authentication logs in Supabase dashboard
5. **Use HTTPS** in production

## 12. Next Steps

After setup is complete:
1. Test all authentication flows
2. Set up your product data
3. Configure payment processing (if needed)
4. Set up monitoring and analytics
5. Plan for scaling as your user base grows

---

**Note:** This setup guide assumes you're using Vite as your build tool. If you're using a different build tool, adjust the environment variable names accordingly (e.g., `NEXT_PUBLIC_` for Next.js).
