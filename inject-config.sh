#!/bin/sh

# Inject runtime configuration into frontend index.html
INDEX_FILE="/usr/share/nginx/html/index.html"
CONFIG_FILE="/usr/share/nginx/html/config.js"

echo "Injecting runtime configuration..."
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:0:20}..."

# Create config.js
cat > $CONFIG_FILE << EOF
window.APP_CONFIG = {
  GOOGLE_CLIENT_ID: '${GOOGLE_CLIENT_ID:-}',
  API_URL: '/api'
};
console.log('Config loaded:', window.APP_CONFIG);
EOF

# Also inject directly into index.html as a backup
if [ -f "$INDEX_FILE" ]; then
  sed -i "s|REPLACE_WITH_GOOGLE_CLIENT_ID|${GOOGLE_CLIENT_ID:-}|g" "$INDEX_FILE"
  echo "Configuration injected into index.html"
fi

echo "Configuration files updated"
ls -la /usr/share/nginx/html/ | grep -E "config.js|index.html"
