#!/bin/sh

# Set default environment variables if not provided
export JWT_SECRET="${JWT_SECRET:-change-this-secret-in-production}"
export NODE_ENV="${NODE_ENV:-production}"
export PORT="${PORT:-5000}"
export DATABASE_URL="postgresql://rewear:rewear123@localhost:5432/rewear"
export UPLOAD_PATH="${UPLOAD_PATH:-/uploads}"

echo "Starting ReWear application..."
echo "JWT_SECRET is set: $([ -n "$JWT_SECRET" ] && echo 'Yes' || echo 'No')"

# Wait for PostgreSQL to be ready
echo "Starting PostgreSQL..."
su postgres -c "pg_ctl -D /var/lib/postgresql/data start"

# Wait for PostgreSQL to be ready
sleep 5

# Create database and user if they don't exist
echo "Setting up database..."
su postgres -c "psql -c \"CREATE USER rewear WITH PASSWORD 'rewear123';\" 2>/dev/null || true"
su postgres -c "psql -c \"CREATE DATABASE rewear OWNER rewear;\" 2>/dev/null || true"
su postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE rewear TO rewear;\" 2>/dev/null || true"

# Stop PostgreSQL (supervisor will start it)
su postgres -c "pg_ctl -D /var/lib/postgresql/data stop"

echo "Starting services with supervisor..."

# Wait a bit for PostgreSQL to be fully ready
sleep 3

# Test database connection
echo "Testing database connection..."
PGPASSWORD=rewear123 psql -h localhost -U rewear -d rewear -c "SELECT 1;" 2>&1 || echo "Database not ready yet, will retry..."

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
