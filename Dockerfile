FROM node:18-alpine

# Install PostgreSQL
RUN apk add --no-cache postgresql postgresql-contrib supervisor nginx

# Create app directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm ci --only=production
RUN cd frontend && npm ci

# Copy application code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npm run build

# Setup nginx
COPY nginx-unified.conf /etc/nginx/http.d/default.conf
RUN mkdir -p /usr/share/nginx/html
RUN cp -r frontend/build/* /usr/share/nginx/html/

# Create necessary directories
RUN mkdir -p /uploads /run/postgresql /var/lib/postgresql/data /var/log/supervisor

# Initialize PostgreSQL
RUN mkdir -p /run/postgresql && chown postgres:postgres /run/postgresql
RUN mkdir -p /var/lib/postgresql/data && chown postgres:postgres /var/lib/postgresql/data
RUN su postgres -c "initdb -D /var/lib/postgresql/data"
RUN echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
RUN echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf

# Copy supervisor config
COPY supervisord.conf /etc/supervisord.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Set default environment variables
ENV JWT_SECRET=change-this-secret-in-production \
    NODE_ENV=production \
    PORT=5000 \
    UPLOAD_PATH=/uploads

# Expose port
EXPOSE 80

# Start supervisor
CMD ["/start.sh"]
