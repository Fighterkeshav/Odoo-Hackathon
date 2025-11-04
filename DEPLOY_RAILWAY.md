# Deploy to Railway (Recommended - Easiest!)

Railway is much simpler than Render and handles Docker better.

## Step 1: Sign Up
1. Go to https://railway.app/
2. Sign up with GitHub

## Step 2: Deploy Backend

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your `Odoo-Hackathon` repository
4. Railway will detect the Dockerfile automatically

### Add Environment Variables:
```
JWT_SECRET=[Your JWT Secret]
GOOGLE_CLIENT_ID=[Your Google Client ID]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret]
GOOGLE_CALLBACK_URL=https://your-app.up.railway.app/api/auth/google/callback
PORT=5000
NODE_ENV=production
```

3. Click **Deploy**
4. Railway will give you a URL like: `https://your-app.up.railway.app`

## Step 3: Update Google OAuth

1. Go to Google Cloud Console
2. Add Railway URL to Authorized JavaScript origins:
   - `https://your-app.up.railway.app`
3. Add to Authorized redirect URIs:
   - `https://your-app.up.railway.app/api/auth/google/callback`

## Step 4: Update GOOGLE_CALLBACK_URL

Go back to Railway and update:
```
GOOGLE_CALLBACK_URL=https://your-actual-railway-url.up.railway.app/api/auth/google/callback
```

## Done!

Your app will be live at: `https://your-app.up.railway.app`

## Advantages of Railway:
- ✅ Automatic HTTPS
- ✅ Better Docker support
- ✅ Faster deployments
- ✅ Built-in PostgreSQL (optional)
- ✅ Free tier: $5/month credit
- ✅ No cold starts
