# Quick Deploy Guide - AWS RDS + Render + Vercel

Your database is ready! Let's deploy in 3 steps.

## Your AWS RDS Database

✅ **Endpoint**: `database-1.c1sogu6ma50l.ap-south-1.rds.amazonaws.com`
✅ **Username**: `postgres`
✅ **Password**: `fighterkeshav7`
✅ **Database**: `postgres`
✅ **Port**: `5432`

## Step 1: Configure AWS RDS Security Group (2 minutes)

1. Go to AWS Console → RDS → Databases → `database-1`
2. Click on the **VPC security group** link
3. Click **Edit inbound rules**
4. Click **Add rule**:
   - Type: `PostgreSQL`
   - Port: `5432`
   - Source: `0.0.0.0/0`
   - Description: `Allow Render access`
5. Click **Save rules**

## Step 2: Deploy Backend to Render (5 minutes)

1. Go to https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Connect your GitHub: `Odoo-Hackathon`
4. Configure:

   - Name: `rewear-backend`
   - Runtime: `Docker`
   - Dockerfile Path: `./Dockerfile.backend`
   - Instance Type: `Free`

5. **Add these Environment Variables**:

```
JWT_SECRET=[Your JWT Secret]
DATABASE_URL=postgresql://postgres:fighterkeshav7@database-1.c1sogu6ma50l.ap-south-1.rds.amazonaws.com:5432/postgres
GOOGLE_CLIENT_ID=[Your Google Client ID]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret]
GOOGLE_CALLBACK_URL=https://rewear-backend.onrender.com/api/auth/google/callback
NODE_ENV=production
PORT=5000
CORS_ORIGIN=*
```

6. Click **Create Web Service**
7. Wait 5-10 minutes for deployment
8. You'll get: `https://rewear-backend.onrender.com`

## Step 3: Deploy Frontend to Vercel (3 minutes)

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click **Add New Project**
4. Import `Odoo-Hackathon` repository
5. Configure:

   - Framework: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

6. **Add Environment Variables**:

```
REACT_APP_API_URL=https://rewear-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

7. Click **Deploy**
8. Wait 2-3 minutes
9. You'll get: `https://your-app.vercel.app`

## Step 4: Update Google OAuth (2 minutes)

1. Go to https://console.cloud.google.com/
2. Select your project
3. Go to **Credentials** → Edit OAuth 2.0 Client
4. Add to **Authorized JavaScript origins**:
   ```
   https://your-vercel-url.vercel.app
   ```
5. Add to **Authorized redirect URIs**:
   ```
   https://rewear-backend.onrender.com/api/auth/google/callback
   ```
6. Click **Save**

## Done! 🎉

Your app is live:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://rewear-backend.onrender.com`
- **Database**: AWS RDS (persistent, never loses data!)

## Test Your App

1. Visit your Vercel URL
2. Create an account
3. Try Google login
4. Add items
5. Test swaps

## Verify Backend is Working

Visit: `https://rewear-backend.onrender.com/api/health`

Should show:

```json
{ "status": "OK", "message": "ReWear API is running" }
```

## Check Database Connection

Look at Render logs for:

```
✓ Configuring Google OAuth...
Database synced successfully
✅ Initial data seeded successfully!
Server is running on port 5000
```

## Troubleshooting

### Backend can't connect to RDS?

**Check RDS is publicly accessible:**

1. AWS Console → RDS → database-1
2. Click **Modify**
3. Under **Connectivity** → **Additional configuration**
4. Set **Public access**: `Yes`
5. Click **Continue** → **Modify DB instance**
6. Wait 5 minutes

**Check Security Group:**

- Inbound rule for port 5432 from 0.0.0.0/0 must exist

### Frontend shows blank page?

- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser console for errors
- Verify environment variables in Vercel

### Google login not working?

- Verify redirect URIs in Google Console match exactly
- Check GOOGLE_CALLBACK_URL in Render
- Make sure both Client IDs match

## Your Setup

```
User Browser
    ↓
Vercel (Frontend - Global CDN)
    ↓
Render (Backend - Docker)
    ↓
AWS RDS (Database - ap-south-1)
```

## Costs

- **Vercel**: FREE forever
- **Render**: FREE (750 hours/month)
- **AWS RDS**: FREE tier (12 months) then ~$15/month

Total: **$0/month** for first year!
