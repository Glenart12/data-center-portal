# Vercel Environment Variables

This document lists all environment variables that need to be configured in the Vercel dashboard for production deployment.

## Required Environment Variables

### Auth0 Configuration
- `AUTH0_SECRET` - Your Auth0 application secret
- `AUTH0_BASE_URL` - Your production URL (e.g., https://yourdomain.vercel.app)
- `AUTH0_ISSUER_BASE_URL` - Your Auth0 domain (e.g., https://datacenterportal.us.auth0.com)
- `AUTH0_CLIENT_ID` - Your Auth0 application client ID
- `AUTH0_CLIENT_SECRET` - Your Auth0 application client secret

### AI Services
- `GEMINI_API_KEY` - Google Gemini API key for AI-powered MOP generation

### Storage
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token for file management

### Public Environment Variables
- `NEXT_PUBLIC_BASE_URL` - Your production URL (same as AUTH0_BASE_URL)

### SerpAPI Configuration (NEW)
- `SERP_API_KEY` - Your SerpAPI key for search functionality
- `SEARCH_ENABLED` - Enable/disable search functionality (set to "true" or "false")
- `SEARCH_CACHE_TTL` - Cache time-to-live in seconds (default: 3600)
- `SEARCH_TIMEOUT` - Search timeout in milliseconds (default: 5000)

## How to Add These Variables in Vercel

1. Go to your project dashboard in Vercel
2. Navigate to Settings → Environment Variables
3. Add each variable listed above
4. Make sure to select the appropriate environments (Production, Preview, Development)
5. Save your changes
6. Redeploy your application for changes to take effect

## Important Notes

- Never commit sensitive API keys or secrets to your repository
- Use different values for development (.env.local) and production (Vercel dashboard)
- The `NEXT_PUBLIC_` prefix makes variables available to the browser, so only use it for non-sensitive data
- Remember to update `SERP_API_KEY` with your actual API key from https://serpapi.com/