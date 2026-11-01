# AWS EC2 Deployment Guide (IaaS)

This guide walks you through deploying **NexaCart AI** on Amazon Elastic Compute Cloud (EC2).

---

## 1. Launching the EC2 Instance

1. Navigate to the **AWS Management Console** > **EC2** > **Launch Instances**.
2. **Name**: `nexacart-web-server`
3. **Application and OS Images (AMI)**: Select **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (64-bit x86 or ARM64).
4. **Instance Type**: `t3.small` (for staging/testing) or `t3.medium` (recommended for production builds).
5. **Key Pair**: Select your existing key pair or create a new key pair (`nexacart-key.pem`).
6. **Network Settings** (Security Group):
   - Allow **SSH (Port 22)** from your IP.
   - Allow **HTTP (Port 80)** from Anywhere (`0.0.0.0/0`).
   - Allow **HTTPS (Port 443)** from Anywhere (`0.0.0.0/0`).
7. **Storage**: 20 GiB gp3 Root Volume.
8. **Advanced Details > User Data**: Paste the contents of `aws/ec2/ec2-user-data.sh`.
9. Click **Launch Instance**.

---

## 2. Deploying the Application Code

Connect to your EC2 instance via SSH:

```bash
ssh -i nexacart-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>
```

Navigate to the application directory and clone/copy the project:

```bash
cd /var/www/nexacart
# Clone your repo or copy the files
git clone <YOUR_REPO_URL> .

# Install server and client dependencies
npm run install:all

# Build frontend static bundle
npm run build:client
```

---

## 3. Configuring Production Environment

Create `/var/www/nexacart/server/.env`:

```bash
nano /var/www/nexacart/server/.env
```

Add your production configuration:

```env
PORT=5001
NODE_ENV=production

# AWS RDS MySQL Credentials
DB_HOST=nexacart-mysql.c9xxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=YourSecureRDSMasterPassword
DB_NAME=nexacart_db

JWT_SECRET=your-production-high-entropy-jwt-secret-string
```

Seed the database with sample products:

```bash
cd /var/www/nexacart/server
npm run seed
```

---

## 4. Starting the Service with Systemd or PM2

### Option A: Using Systemd (Recommended for IaaS)
```bash
sudo cp /var/www/nexacart/aws/ec2/nexacart.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable nexacart
sudo systemctl start nexacart
sudo systemctl status nexacart
```

### Option B: Using PM2
```bash
cd /var/www/nexacart/server
pm2 start server.js --name "nexacart-api"
pm2 save
pm2 startup
```

---

## 5. Configuring Free SSL with Let's Encrypt Certbot

Once your custom domain's DNS A-record points to the EC2 Public IP:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot will automatically modify `/etc/nginx/sites-available/nexacart` and install the HTTPS certificates.

