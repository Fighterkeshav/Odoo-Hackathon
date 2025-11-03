#!/bin/sh

echo "=== Backend Starting ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "JWT_SECRET: ${JWT_SECRET:0:10}..."
echo "UPLOAD_PATH: $UPLOAD_PATH"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
for i in 1 2 3 4 5 6 7 8 9 10; do
  if PGPASSWORD=rewear123 psql -h localhost -U rewear -d rewear -c "SELECT 1;" > /dev/null 2>&1; then
    echo "PostgreSQL is ready!"
    break
  fi
  echo "Waiting for PostgreSQL... attempt $i"
  sleep 2
done

echo "Starting Node.js server..."
cd /app/backend
exec node server.js
