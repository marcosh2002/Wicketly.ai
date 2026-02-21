#!/bin/sh
set -e

PORT=${PORT:-3000}

# Update nginx config with the correct port
sed -i "s/listen 3000/listen $PORT/g" /etc/nginx/conf.d/default.conf

echo "Starting nginx on port $PORT..."
nginx -g 'daemon off;'
