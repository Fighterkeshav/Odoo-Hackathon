#!/bin/sh

# Inject runtime configuration into frontend config.js
CONFIG_FILE="/usr/share/nginx/html/config.js"

echo "Injecting runtime configuration..."

cat > $CONFIG_FILE << EOF
window.APP_CONFIG = {
  GOOGLE_CLIENT_ID: '${GOOGLE_CLIENT_ID:-}',
  API_URL: '/api'
};
EOF

echo "Configuration injected:"
cat $CONFIG_FILE
