# Deploy Frontend to Vercel + Backend to Railway

This is the BEST approach - separate frontend and backend!

## Part 1: Deploy Backend to Railway

Follow `DEPLOY_RAILWAY.md` to deploy the backend.

You'll get a backend URL like: `https://rewear-backend.up.railway.app`

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. Update `frontend/.env.production`:
```
REACT_APP_API_URL=https://rewear-backend.up.railway.app
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click **Add New Project**
4. Import your `Odoo-Hackathon` repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

6. Add Environment Variables:
```
REACT_APP_API_URL=https://rewear-backend.up.railway.app
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

7. Click **Deploy**

### Step 3: Update Google OAuth

Add Vercel URL to Google Cloud Console:
- Authorized JavaScript origins: `https://your-app.vercel.app`
- Authorized redirect URIs: `https://rewear-backend.up.railway.app/api/auth/google/callback`

### Step 4: Update Backend CORS

In Railway, update backend environment variable:
```
CORS_ORIGIN=https://your-app.vercel.app
```

## Done!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://rewear-backend.up.railway.app`

## Why This is Better:

- ✅ Frontend on Vercel = Lightning fast CDN
- ✅ Backend on Railway = Reliable Docker hosting
- ✅ Separate scaling
- ✅ Better performance
- ✅ Easier debugging
- ✅ Both have generous free tiers
