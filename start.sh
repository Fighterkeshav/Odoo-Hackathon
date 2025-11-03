#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Starting PostgreSQL..."
su postgres -c "pg_ctl -D /var/lib/postgresql/data start"

# Wait for PostgreSQL to be ready
sleep 5

# Create database and user if they don't exist
su postgres -c "psql -c \"CREATE USER rewear WITH PASSWORD 'rewear123';\" 2>/dev/null || true"
su postgres -c "psql -c \"CREATE DATABASE rewear OWNER rewear;\" 2>/dev/null || true"
su postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE rewear TO rewear;\" 2>/dev/null || true"

# Stop PostgreSQL (supervisor will start it)
su postgres -c "pg_ctl -D /var/lib/postgresql/data stop"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
