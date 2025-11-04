# Deploy: Vercel (Frontend) + Render (Backend) - 100% FREE!

Best of both worlds - Vercel's fast CDN for frontend + Render's free Docker for backend.

## Part 1: Deploy Backend to Render (FREE)

### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com/
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `rewear-db`
   - **Database**: `rewear`
   - **User**: `rewear`
   - **Region**: Choose closest
   - **Instance Type**: `Free`
4. Click **Create Database**
5. Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 2: Deploy Backend

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `rewear-backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile.backend`
   - **Instance Type**: `Free`

### Step 3: Add Backend Environment Variables

```
NODE_ENV=production
PORT=5000
JWT_SECRET=[Your JWT Secret - generate a random 32+ character string]
DATABASE_URL=[Paste the Internal Database URL from Step 1]
GOOGLE_CLIENT_ID=[Your Google Client ID]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret]
GOOGLE_CALLBACK_URL=https://rewear-backend.onrender.com/api/auth/google/callback
CORS_ORIGIN=https://rewear-frontend.vercel.app
```

4. Click **Create Web Service**
5. Wait for deployment (5-10 minutes)
6. You'll get: `https://rewear-backend.onrender.com`

## Part 2: Deploy Frontend to Vercel (FREE)

### Step 1: Update Frontend Config

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://rewear-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

Commit and push:
```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/
2. Sign up with GitHub (FREE)
3. Click **Add New Project**
4. Import your `Odoo-Hackathon` repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Add Frontend Environment Variables

```
REACT_APP_API_URL=https://rewear-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

6. Click **Deploy**
7. Wait 2-3 minutes
8. You'll get: `https://rewear-frontend.vercel.app` (or custom domain)

## Part 3: Update Backend CORS

1. Go back to Render backend service
2. Update environment variable:
```
CORS_ORIGIN=https://your-actual-vercel-url.vercel.app
```
3. Save (will auto-redeploy)

## Part 4: Configure Google OAuth

1. Go to https://console.cloud.google.com/
2. Select your project
3. Go to **Credentials**
4. Edit your OAuth 2.0 Client

### Add Authorized JavaScript origins:
```
https://your-vercel-url.vercel.app
```

### Add Authorized redirect URIs:
```
https://rewear-backend.onrender.com/api/auth/google/callback
```

5. Save

## Done! 🎉

- **Frontend**: `https://your-app.vercel.app` (Lightning fast!)
- **Backend**: `https://rewear-backend.onrender.com`
- **Database**: PostgreSQL on Render

## Test Your App

1. Visit your Vercel URL
2. Try creating an account
3. Try Google login
4. Add items, test swaps!

## Why This Setup is BEST:

### Vercel (Frontend):
- ✅ 100% FREE forever
- ✅ Global CDN (super fast worldwide)
- ✅ Automatic HTTPS
- ✅ Instant deployments (30 seconds)
- ✅ No cold starts
- ✅ Perfect for React apps

### Render (Backend):
- ✅ FREE tier (750 hours/month)
- ✅ Docker support
- ✅ Free PostgreSQL database
- ✅ Automatic HTTPS
- ✅ Easy environment variables

### Combined Benefits:
- ✅ Separate scaling
- ✅ Easy debugging
- ✅ Professional setup
- ✅ Production-ready
- ✅ 100% FREE!

## Limitations (Free Tier):

### Render Backend:
- Spins down after 15 min inactivity
- First request takes ~30 seconds to wake up
- 750 hours/month (enough for demos)

### Vercel Frontend:
- No limitations! Always fast!

## Upgrade Options (Optional):

If you need 24/7 uptime:
- **Render**: $7/month for always-on backend
- **Vercel**: Free tier is usually enough!

## Troubleshooting

### Backend not responding?
- Check Render logs
- Verify DATABASE_URL is set
- Wait 30 seconds for cold start

### Frontend can't connect to backend?
- Check CORS_ORIGIN matches your Vercel URL
- Verify REACT_APP_API_URL is correct
- Hard refresh browser (Ctrl+Shift+R)

### Google login not working?
- Verify redirect URIs in Google Console
- Check GOOGLE_CALLBACK_URL in Render
- Make sure GOOGLE_CLIENT_ID matches in both places

## Alternative: Netlify Instead of Vercel

If you prefer Netlify (also FREE):

1. Go to https://netlify.com/
2. Drag and drop your `frontend/build` folder
3. Or connect GitHub repo
4. Same environment variables as Vercel
5. Works exactly the same!

Both Vercel and Netlify are excellent for React apps!
