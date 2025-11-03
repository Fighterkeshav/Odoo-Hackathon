# Render Environment Variables Setup

## Your App URL
https://rewear-ahp2.onrender.com

## How to Add Environment Variables in Render

1. Go to: https://dashboard.render.com/
2. Click on your **rewear** service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add the variables below

---

## Required Environment Variable

### JWT_SECRET (Required)
```
Key: JWT_SECRET
Value: change-this-to-a-random-secret-key-min-32-characters
```

**Generate a secure JWT_SECRET:**
- Use a password generator
- Or run this in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Should be at least 32 characters long

---

## Optional: Google OAuth Setup

If you want users to login with Google:

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Name it: `ReWear Production`

**Add Authorized JavaScript origins:**
```
https://rewear-ahp2.onrender.com
```

**Add Authorized redirect URIs:**
```
https://rewear-ahp2.onrender.com/api/auth/google/callback
```

7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 2: Add to Render

Add these three environment variables in Render:

```
Key: GOOGLE_CLIENT_ID
Value: [paste your Client ID from Google]

Key: GOOGLE_CLIENT_SECRET
Value: [paste your Client Secret from Google]

Key: GOOGLE_CALLBACK_URL
Value: https://rewear-ahp2.onrender.com/api/auth/google/callback
```

---

## Summary

**Minimum to get started (email/password login only):**
- Just add `JWT_SECRET`

**Full features (with Google login):**
- Add `JWT_SECRET`
- Add `GOOGLE_CLIENT_ID`
- Add `GOOGLE_CLIENT_SECRET`
- Add `GOOGLE_CALLBACK_URL`

---

## After Adding Variables

1. Click **Save Changes** in Render
2. Your service will automatically redeploy
3. Wait 2-3 minutes for the new build
4. Visit https://rewear-ahp2.onrender.com
5. Test by creating an account!

---

## Testing

### Test Email/Password Login:
1. Go to https://rewear-ahp2.onrender.com
2. Click "Sign Up"
3. Create account with email and password
4. Login and start using the app!

### Test Google Login (if configured):
1. Go to https://rewear-ahp2.onrender.com
2. Click "Sign in with Google"
3. Select your Google account
4. Should redirect back and be logged in!

---

## Troubleshooting

### App not loading?
- Check Render logs for errors
- Verify JWT_SECRET is set
- Wait for deployment to complete (check Render dashboard)

### Google login not working?
- Verify all 3 Google variables are set correctly
- Check Google Cloud Console redirect URIs match exactly
- Make sure Google+ API is enabled

### Backend errors?
- Check Render logs: Dashboard → Your Service → Logs
- Look for startup errors or database connection issues
