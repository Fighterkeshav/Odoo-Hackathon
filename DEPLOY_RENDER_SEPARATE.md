# Deploy to Render - Separate Services (FREE!)

Deploy backend and frontend as separate services on Render's free tier.

## Part 1: Deploy Backend

### Step 1: Create Web Service for Backend

1. Go to https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `rewear-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Docker`
   - **Docker Build Context**: `.`
   - **Dockerfile Path**: `./Dockerfile.backend`
   - **Instance Type**: `Free`

### Step 2: Add Environment Variables

```
NODE_ENV=production
PORT=5000
JWT_SECRET=[Your JWT Secret]
DATABASE_URL=postgresql://rewear:rewear123@localhost:5432/rewear
GOOGLE_CLIENT_ID=[Your Google Client ID]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret]
GOOGLE_CALLBACK_URL=https://rewear-backend.onrender.com/api/auth/google/callback
CORS_ORIGIN=https://rewear-frontend.onrender.com
```

### Step 3: Deploy

Click **Create Web Service**

You'll get a URL like: `https://rewear-backend.onrender.com`

## Part 2: Deploy Frontend

### Step 1: Update Frontend Environment

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://rewear-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

Commit and push this file.

### Step 2: Create Web Service for Frontend

1. Click **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `rewear-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Step 3: Add Environment Variables

```
REACT_APP_API_URL=https://rewear-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

### Step 4: Deploy

Click **Create Static Site**

You'll get a URL like: `https://rewear-frontend.onrender.com`

## Part 3: Update Backend CORS

Go back to backend service and update:
```
CORS_ORIGIN=https://rewear-frontend.onrender.com
```

## Part 4: Update Google OAuth

1. Go to Google Cloud Console
2. Add to Authorized JavaScript origins:
   - `https://rewear-frontend.onrender.com`
3. Add to Authorized redirect URIs:
   - `https://rewear-backend.onrender.com/api/auth/google/callback`

## Done!

- Frontend: `https://rewear-frontend.onrender.com`
- Backend: `https://rewear-backend.onrender.com`

## Advantages:

- ✅ 100% FREE (both services on free tier)
- ✅ Separate services = easier debugging
- ✅ Frontend is static = faster
- ✅ Backend has PostgreSQL included
- ✅ No complex Docker setup needed

## Notes:

- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Perfect for demos and development!
