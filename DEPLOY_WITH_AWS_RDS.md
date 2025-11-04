# Deploy with AWS RDS PostgreSQL

Using your existing AWS RDS database: `database-1`

## Your Database Info

- **Database Name**: `database-1`
- **Password**: `fighterkeshav7`
- **Username**: `postgres` (or your RDS username)
- **Endpoint**: `database-1.xxxxx.region.rds.amazonaws.com` (get from AWS Console)
- **Port**: `5432`

## Step 1: Get Your RDS Connection String

1. Go to AWS Console → RDS → Databases
2. Click on `database-1`
3. Copy the **Endpoint** (looks like: `database-1.c1234567890.us-east-1.rds.amazonaws.com`)
4. Note the **Port** (usually 5432)

Your connection string will be:

```
postgresql://postgres:fighterkeshav7@database-1.xxxxx.region.rds.amazonaws.com:5432/postgres
```

Replace `xxxxx.region` with your actual endpoint.

## Step 2: Configure RDS Security Group

**IMPORTANT**: Allow inbound connections from Render/Vercel

1. Go to AWS Console → RDS → `database-1`
2. Click on the **VPC security group**
3. Click **Edit inbound rules**
4. Add rule:
   - **Type**: PostgreSQL
   - **Port**: 5432
   - **Source**: `0.0.0.0/0` (Allow from anywhere)
   - **Description**: Render/Vercel access

⚠️ **Note**: For production, restrict to specific IPs. For now, `0.0.0.0/0` allows testing.

## Step 3: Deploy Backend to Render

### Create Web Service

1. Go to https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `rewear-backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile.backend`
   - **Instance Type**: `Free`

### Add Environment Variables

```
NODE_ENV=production
PORT=5000
JWT_SECRET=k9Z!pR3t@8w#Lx^F1uC*sQ7vJgE0zD$B2yM&HnT=oA5rKjW+qIbP%S4NcUfO
DATABASE_URL=postgresql://postgres:fighterkeshav7@database-1.xxxxx.region.rds.amazonaws.com:5432/postgres
GOOGLE_CLIENT_ID=[Your Google Client ID]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret]
GOOGLE_CALLBACK_URL=https://rewear-backend.onrender.com/api/auth/google/callback
CORS_ORIGIN=*
```

**Replace** `database-1.xxxxx.region.rds.amazonaws.com` with your actual RDS endpoint!

4. Click **Create Web Service**
5. Wait for deployment

## Step 4: Deploy Frontend to Vercel

### Update Frontend Config

Create `frontend/.env.production`:

```
REACT_APP_API_URL=https://rewear-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

Commit and push:

```bash
git add frontend/.env.production
git commit -m "Add production config with RDS"
git push origin main
```

### Deploy to Vercel

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click **Add New Project**
4. Import your repository
5. Configure:

   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

6. Add Environment Variables:

```
REACT_APP_API_URL=https://rewear-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=[Your Google Client ID]
```

7. Click **Deploy**

## Step 5: Update Google OAuth

1. Go to Google Cloud Console
2. Add to **Authorized JavaScript origins**:
   - `https://your-vercel-url.vercel.app`
3. Add to **Authorized redirect URIs**:
   - `https://rewear-backend.onrender.com/api/auth/google/callback`

## Step 6: Test Database Connection

After backend deploys, check Render logs for:

```
✓ Database synced successfully
✅ Initial data seeded successfully!
```

If you see errors, check:

1. RDS endpoint is correct
2. Security group allows inbound on port 5432
3. Password is correct
4. Database exists

## Benefits of Using AWS RDS

- ✅ Persistent database (never loses data)
- ✅ Automatic backups
- ✅ Better performance than container DB
- ✅ Can scale independently
- ✅ Professional setup
- ✅ Free tier: 750 hours/month

## Architecture

```
Frontend (Vercel)
    ↓
Backend (Render)
    ↓
Database (AWS RDS)
```

## Costs

- **Vercel**: FREE forever
- **Render**: FREE (750 hours/month)
- **AWS RDS**: FREE tier (12 months) or ~$15/month after

## Troubleshooting

### Backend can't connect to RDS?

1. **Check Security Group**:

   - Go to RDS → database-1 → VPC security groups
   - Verify inbound rule allows port 5432 from 0.0.0.0/0

2. **Check RDS is publicly accessible**:

   - Go to RDS → database-1 → Connectivity & security
   - "Publicly accessible" should be "Yes"
   - If "No", modify the database to make it public

3. **Verify connection string**:

   ```
   postgresql://USERNAME:PASSWORD@ENDPOINT:5432/DATABASE
   ```

   - USERNAME: usually `postgres`
   - PASSWORD: `fighterkeshav7`
   - ENDPOINT: from RDS console
   - DATABASE: `postgres` (default) or your database name

4. **Test connection locally**:
   ```bash
   psql "postgresql://postgres:fighterkeshav7@your-endpoint:5432/postgres"
   ```

### RDS Not Publicly Accessible?

1. Go to RDS → database-1
2. Click **Modify**
3. Under **Connectivity**:
   - Set "Public access" to **Yes**
4. Click **Continue** → **Modify DB instance**
5. Wait 5-10 minutes for changes to apply

## Next Steps

Once deployed:

1. Visit your Vercel URL
2. Create an account
3. Test all features
4. Your data is now safely stored in AWS RDS!
