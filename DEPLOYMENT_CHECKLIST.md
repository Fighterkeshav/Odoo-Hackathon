# Deployment Checklist - Fix "Route not found" Error

## Problem
The app shows "Route not found" because Google OAuth environment variables are not set in Render.

## Solution: Add Environment Variables in Render

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com/
2. Click on your **rewear** service
3. Click on **Environment** tab (left sidebar)

### Step 2: Add These 4 Environment Variables

Click "Add Environment Variable" for each:

#### Variable 1: JWT_SECRET
```
Key: JWT_SECRET
Value: k9Z!pR3t@8w#Lx^F1uC*sQ7vJgE0zD$B2yM&HnT=oA5rKjW+qIbP%S4NcUfO
```

#### Variable 2: GOOGLE_CLIENT_ID
```
Key: GOOGLE_CLIENT_ID
Value: [Your Google Client ID from Google Cloud Console]
```

#### Variable 3: GOOGLE_CLIENT_SECRET
```
Key: GOOGLE_CLIENT_SECRET
Value: [Your Google Client Secret from Google Cloud Console]
```

#### Variable 4: GOOGLE_CALLBACK_URL
```
Key: GOOGLE_CALLBACK_URL
Value: https://rewear-ahp2.onrender.com/api/auth/google/callback
```

### Step 3: Save and Redeploy
1. Click **Save Changes** button
2. Render will automatically redeploy (takes 2-3 minutes)
3. Wait for "Live" status

### Step 4: Verify It Works

After deployment completes, test these URLs:

1. **Backend health check:**
   https://rewear-ahp2.onrender.com/api/health
   - Should show: `{"status":"OK","message":"ReWear API is running"}`

2. **Configuration check:**
   https://rewear-ahp2.onrender.com/api/debug/config
   - Should show: `"googleOAuthConfigured": true`

3. **Google OAuth:**
   https://rewear-ahp2.onrender.com/api/auth/google
   - Should redirect to Google login page

4. **Main app:**
   https://rewear-ahp2.onrender.com
   - Should show the ReWear homepage

## What to Look For in Logs

After adding environment variables, check Render logs for:

✅ **Success indicators:**
```
✓ Configuring Google OAuth...
  Client ID: 438758700737-vcsesjp...
  Callback URL: https://rewear-ahp2.onrender.com/api/auth/google/callback
Loading routes...
Routes loaded successfully
Server is running on port 5000
```

❌ **Error indicators:**
```
⚠ Google OAuth not configured
  GOOGLE_CLIENT_ID: Not set
  GOOGLE_CLIENT_SECRET: Not set
```

## Troubleshooting

### If still showing "Route not found":
1. Double-check all 4 environment variables are set correctly
2. Make sure there are no extra spaces in the values
3. Click "Save Changes" and wait for redeploy
4. Check logs for "✓ Configuring Google OAuth..."

### If Google login doesn't work:
1. Verify Google Cloud Console has the correct redirect URI:
   `https://rewear-ahp2.onrender.com/api/auth/google/callback`
2. Make sure it's in "Authorized redirect URIs" section
3. Also add `https://rewear-ahp2.onrender.com` to "Authorized JavaScript origins"

### If frontend is blank:
1. Check browser console (F12) for errors
2. Visit https://rewear-ahp2.onrender.com/config.js
3. Should show your Google Client ID

## Security Note

⚠️ **IMPORTANT:** Keep your Google Client Secret secure. Never commit it to public repositories.

1. Go to Google Cloud Console
2. Delete the old secret
3. Create a new secret
4. Update the `GOOGLE_CLIENT_SECRET` in Render with the new value

## Current Status

- ✅ Docker image built successfully
- ✅ Code is correct and ready
- ❌ Environment variables not set in Render
- ❌ App not working yet

**Next Action:** Add the 4 environment variables in Render Dashboard!
