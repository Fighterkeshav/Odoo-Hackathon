# Deployment Guide - Unified Docker Image

## Quick Deploy

The application is packaged as a single Docker image containing:
- Frontend (React + Nginx)
- Backend (Node.js + Express)
- Database (PostgreSQL)

Everything runs on port 80, no configuration needed!

## Deploy on Any Platform

### Option 1: Docker Run (Simplest)

```bash
docker run -d \
  -p 80:80 \
  -e JWT_SECRET=your-secret-key-here \
  --name rewear \
  fighterkeshav7/rewear:latest
```

**With persistent data (recommended):**
```bash
docker run -d \
  -p 80:80 \
  -e JWT_SECRET=your-secret-key-here \
  -v rewear-data:/var/lib/postgresql/data \
  -v rewear-uploads:/uploads \
  --name rewear \
  fighterkeshav7/rewear:latest
```

Access at: http://localhost

### Option 2: AWS EC2

1. **Launch EC2 instance** (Ubuntu/Amazon Linux)
2. **Install Docker:**
   ```bash
   sudo yum update -y
   sudo yum install docker -y
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```
3. **Run container:**
   ```bash
   docker run -d \
     -p 80:80 \
     -e JWT_SECRET=your-secret-key-here \
     -v rewear-data:/var/lib/postgresql/data \
     -v rewear-uploads:/uploads \
     --restart unless-stopped \
     --name rewear \
     fighterkeshav7/rewear:latest
   ```
4. **Open port 80** in Security Group
5. Access at: http://your-ec2-ip

### Option 3: Render

1. Create new **Web Service**
2. Select **Docker**
3. Image URL: `fighterkeshav7/rewear:latest`
4. Add environment variable:
   - `JWT_SECRET`: your-secret-key
5. Deploy!

### Option 4: Railway

1. Create new project
2. Deploy from Docker image: `fighterkeshav7/rewear:latest`
3. Add environment variable:
   - `JWT_SECRET`: your-secret-key
4. Railway will auto-assign a URL

### Option 5: DigitalOcean

1. Create Droplet with Docker
2. SSH into droplet
3. Run:
   ```bash
   docker run -d \
     -p 80:80 \
     -e JWT_SECRET=your-secret-key-here \
     -v rewear-data:/var/lib/postgresql/data \
     -v rewear-uploads:/uploads \
     --restart unless-stopped \
     --name rewear \
     fighterkeshav7/rewear:latest
   ```

## Environment Variables

Only one required:
- `JWT_SECRET`: Secret key for JWT tokens (required)

Optional:
- `PORT`: Internal backend port (default: 5000)

## Persistent Data

Two volumes for data persistence:
- `/var/lib/postgresql/data` - Database
- `/uploads` - User uploaded images

## Health Check

```bash
curl http://localhost/api/health
```

## View Logs

```bash
docker logs rewear
```

## Update to Latest Version

```bash
docker pull fighterkeshav7/rewear:latest
docker stop rewear
docker rm rewear
# Run the docker run command again
```

## No Configuration Needed!

- ✅ Frontend automatically connects to backend
- ✅ Backend automatically connects to database
- ✅ All services start automatically
- ✅ Single port (80) to expose
- ✅ Works on any platform that supports Docker
