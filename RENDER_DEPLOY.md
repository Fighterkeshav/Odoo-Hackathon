# Deploy to Render

## Quick Deploy Steps

### 1. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Select **Deploy an existing image from a registry**
4. Image URL: `fighterkeshav7/rewear:latest`

### 2. Configure Service

**Basic Settings:**
- Name: `rewear` (or your choice)
- Region: Choose closest to you
- Instance Type: Free or Starter

**Environment Variables (Required):**

Add these in the Environment section:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Optional - For Google OAuth (if you want Google login):**

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-app-name.onrender.com/api/auth/google/callback
```

### 3. Google OAuth Setup (Optional)

If you want to enable Google login:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized JavaScript origins:
   - `https://your-app-name.onrender.com`
7. Add Authorized redirect URIs:
   - `https://your-app-name.onrender.com/api/auth/google/callback`
8. Copy the Client ID and Client Secret
9. Add them as environment variables in Render (see step 2)

### 4. Deploy

Click **Create Web Service**

Render will:
- Pull the Docker image
- Start the container
- Your app will be available at: `https://your-app-name.onrender.com`

### 5. First Time Setup

After deployment:
1. Visit your app URL
2. Create an account using email/password
3. Start adding items!

## Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Database data persists between restarts

### Upgrading to Paid Plan
For production use, consider upgrading to:
- **Starter Plan** ($7/month) - No spin-down, better performance
- Keeps your app always running
- Faster response times

## Troubleshooting

### App not loading?
Check the logs in Render dashboard:
1. Go to your service
2. Click **Logs** tab
3. Look for errors

### Database issues?
The database is included in the container and persists automatically.

### Need to update?
The app auto-updates when you push to GitHub main branch!

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| JWT_SECRET | Yes | - | Secret key for JWT tokens |
| GOOGLE_CLIENT_ID | No | - | Google OAuth Client ID |
| GOOGLE_CLIENT_SECRET | No | - | Google OAuth Client Secret |
| GOOGLE_CALLBACK_URL | No | - | Full callback URL for Google OAuth |

## Support

If you encounter issues:
1. Check Render logs
2. Verify environment variables are set
3. Ensure Google OAuth URLs match your deployment URL
