# Docker Setup for ReWear

## Quick Start

1. **Copy environment file:**
   ```bash
   copy .env.docker .env
   ```

2. **Update the JWT_SECRET in .env file**

3. **Build and run containers:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Commands

### Start containers
```bash
docker-compose up -d
```

### Stop containers
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### Stop and remove everything (including volumes)
```bash
docker-compose down -v
```

## Architecture

- **Backend**: Node.js/Express API running on port 5000
- **Frontend**: React app served by Nginx on port 80 (mapped to 3000)
- **Database**: SQLite (stored in backend container volume)
- **Uploads**: Shared volume for file uploads

## Environment Variables

Edit `.env` file to configure:
- `JWT_SECRET`: Secret key for JWT tokens (required)

## Troubleshooting

### Check container status
```bash
docker-compose ps
```

### Access backend container
```bash
docker exec -it rewear-backend sh
```

### Access frontend container
```bash
docker exec -it rewear-frontend sh
```

### View specific service logs
```bash
docker-compose logs backend
docker-compose logs frontend
```
