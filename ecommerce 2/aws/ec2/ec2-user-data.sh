#!/bin/bash
# =======================================================
# NexaCart AI - AWS EC2 User Data Provisioning Script
# Target OS: Ubuntu 22.04 LTS / 24.04 LTS
# =======================================================

set -e

# Redirect output to provisioning log
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "⚡ [NexaCart Provisioner] Starting EC2 initialization..."

# 1. Update OS packages
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

# 2. Install core utilities & Nginx
apt-get install -y curl git ufw nginx software-properties-common certbot python3-certbot-nginx

# 3. Install Node.js 20.x LTS & NPM
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

echo "✔ Node version: $(node -v), NPM version: $(npm -v), PM2 version: $(pm2 -v)"

# 4. Configure Firewall (UFW)
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 5. Create application directory
APP_DIR="/var/www/nexacart"
mkdir -p $APP_DIR
chown -R ubuntu:ubuntu $APP_DIR

# 6. Configure Nginx Reverse Proxy
cat <<'EOF' > /etc/nginx/sites-available/nexacart
server {
    listen 80;
    server_name _;

    client_max_body_size 20M;

    # Backend API endpoints reverse proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend Single Page Application
    location / {
        root /var/www/nexacart/client/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/nexacart /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# 7. Setup Systemd Service Unit for Node Backend
cat <<'EOF' > /etc/systemd/system/nexacart.service
[Unit]
Description=NexaCart AI Backend Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/nexacart/server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=5001

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload

echo "⚡ [NexaCart Provisioner] Provisioning completed successfully!"
echo "Next step: Pull application repository to /var/www/nexacart, run 'npm run install:all && npm run build:client', and run 'systemctl start nexacart'."

