# ⚡ NexaCart AI — Next-Gen AI Hardware E-Commerce Platform

[![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Vite%20%7C%20TailwindCSS%20%7C%20Node.js%20%7C%20Express%20%7C%20MySQL-8B5CF6?style=for-the-badge)](https://github.com)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20Beanstalk%20%7C%20RDS%20%7C%20S3%20%7C%20IAM%20%7C%20Cognito%20%7C%20WAF%20%7C%20CloudTrail-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com)
[![DevOps](https://img.shields.io/badge/Orchestration-Docker%20%7C%20Kubernetes%20(EKS)-06B6D4?style=for-the-badge&logo=kubernetes)](https://kubernetes.io)

**NexaCart AI** is a premium, full-stack AI-themed e-commerce platform engineered for commercial distribution of next-generation tensor compute, autonomous swarm robotics, brain-computer interfaces, and spatial holographic displays.

Designed with a dark navy/purple aesthetic, glowing neon accents, glassmorphic cards, smooth micro-interactions, and a real backend with MySQL database persistence.

---

## 🏛️ System Architecture

```
                       ┌────────────────────────────────────────────────────────┐
                       │                     CLIENT TIER                        │
                       │   React 18 • Vite • Tailwind CSS • Responsive UI       │
                       └───────────────────────────┬────────────────────────────┘
                                                   │
                                      HTTP / REST API (Port 5001)
                                                   │
                       ┌───────────────────────────▼────────────────────────────┐
                       │                     SERVER TIER                        │
                       │   Node.js 20 • Express REST API • JWT & Bcrypt Auth   │
                       │   Nexa AI Recommendation Engine • Admin Analytics      │
                       └───────────────────────────┬────────────────────────────┘
                                                   │
                        ┌──────────────────────────┴──────────────────────────┐
                        │                                                     │
           ┌────────────▼─────────────┐                         ┌─────────────▼────────────┐
           │     DATABASE TIER        │                         │      AWS CLOUD TIER      │
           │  MySQL 8.0 / RDS MySQL   │                         │  • S3 Asset Bucket       │
           │  (Dual-Engine Fallback)  │                         │  • Cognito User Pool     │
           │  Full Schema & Seed SQL  │                         │  • WAF Security Rules    │
           └──────────────────────────┘                         │  • CloudTrail Auditing   │
                                                                └──────────────────────────┘
```

---

## ✨ Core Features Built

### 1. 🌟 AI-Inspired Hero & Home Page
- **Cybernetic Hero Section**: Particle glows, benchmark stats (980 TOPS, <3ms latency, 1.2 TB/s bandwidth, 100% air-gapped capable).
- **Interactive "Ask Nexa AI" Consultation Bar**: Allows users to input their workload (e.g. *"I need an edge TPU to fine-tune 7B LLMs"*) and instantly receive semantic silicon recommendations with AI rationale.
- **Architectural Domains Grid**: Categorized into *Neural Processors & TPUs*, *Autonomous Robotics*, *Neuro Wearables*, *Holographic Systems*, and *Edge AI Hubs*.
- **Live AWS Cloud Hub Diagnostics Modal**: Live telemetry showing the exact configuration status of RDS MySQL, S3, EC2/Beanstalk, WAF, and Kubernetes.

### 2. 🔍 Product Catalogue & Search
- Real-time instant debounce search across names, descriptions, and silicon features.
- Dynamic category tabs and price range filtering.
- Multi-parameter sorting (Price low-to-high, high-to-low, rating, newest).
- Stock level indicators with real-time inventory counts.

### 3. 🔬 Product Details & Silicon Telemetry
- Detailed hardware views with image zoom and spec badges (*Bestseller*, *Pro Spec*, *New Era*).
- Comprehensive silicon telemetry table (*Compute TOPS*, *Memory Bandwidth*, *Power Envelope*, *Framework Compatibility*).
- Quantity counter with stock limits, **Add to Cart**, and **Instant Buy & Checkout**.
- Customer reviews system with star ratings and live review submission.
- Related products recommendations carousel.

### 4. 🛒 Shopping Cart & Checkout
- Slide-out Cart Drawer and dedicated `/cart` page with real-time subtotal, discount, tax (8%), and shipping calculation (Free over $500).
- Working promo code engine: Try **`NEXAAI20`** for 20% off or **`CYBER10`** for 10% off.
- Streamlined Checkout: Pre-filled shipping address, simulated payment selector (*AI Pay Card*, *Apple Pay*, *Compute Credits*), and formatted card inputs.
- Confetti celebration effect upon authorized checkout with automated database stock decrement.
- Digital order confirmation receipt with tracking timeline and order numbers (`NEXA-XXXXX`).

### 5. 👤 User Profile & Order History
- Profile management: Edit full name, contact phone, shipping destination, and avatar image.
- Order History: Real-time listing of past orders with status badges (*Pending*, *Processing*, *Shipped*, *Delivered*) and itemized breakdowns.

### 6. 🛡️ Root Admin Command Center
- **Executive Metrics**: Gross sales revenue ($), total orders placed, catalog units, and low-stock warnings.
- **Visual Sales Analytics**: Interactive monthly revenue trend bar chart and category inventory distribution bars.
- **Product Management (CRUD)**: Deploy new hardware units, edit existing product specs, or permanently delete items from MySQL.
- **Order Management**: Real-time status update dropdown (*Pending* ➔ *Processing* ➔ *Shipped* ➔ *Delivered* ➔ *Cancelled*) directly synced to the database.

---

## 🔑 Pre-Configured Evaluation Accounts

For immediate evaluation, the database includes two pre-seeded accounts:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@nexacart.ai` | `Password123!` | Access to Admin Dashboard (`/admin`), Sales Analytics, Product CRUD, Order Status Management |
| **Customer** | `alex@nexacart.ai` | `Password123!` | Full customer shopping flow, Order History (`/profile`), Reviews |

*Tip: The Login page includes 1-click quick evaluation buttons to log in instantly without typing credentials.*

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js 20.x or higher
- Git

### Option 1: Instant Local Setup (Zero-Config)
The project includes an intelligent dual-engine database client: If a local MySQL daemon is detected, it connects to MySQL; if not, it automatically runs an embedded persistence store so you can test all features without setup friction!

```bash
# 1. Clone the repository
git clone <REPO_URL>
cd ecommerce

# 2. Install dependencies for both backend and frontend
npm run install:all

# 3. Build the frontend client bundle
npm run build:client

# 4. Start the backend server (runs on http://localhost:5001)
npm run server

# 5. In a separate terminal, start the Vite development server (runs on http://localhost:5173)
npm run client
```

Now open [http://localhost:5173](http://localhost:5173) in your browser!

---

### Option 2: Full Docker Compose with MySQL 8.0

To run the complete production-identical multi-container stack (MySQL 8.0 + Node Backend + Nginx Frontend):

```bash
docker-compose up --build
```

- **Frontend Application**: [http://localhost:80](http://localhost:80) or [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)
- **MySQL Container**: `localhost:3306` (Database: `nexacart_db`, Root Password: `rootpassword`)

---

## 🗄️ Database Architecture & Schema

The complete relational MySQL DDL is available at `server/database/schema.sql` and `server/database/seed.sql`.

```sql
CREATE DATABASE IF NOT EXISTS nexacart_db;
USE nexacart_db;

-- 1. Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255),
  phone VARCHAR(30),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'Cpu'
);

-- 3. Products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category_id INT,
  category_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock INT NOT NULL DEFAULT 25,
  rating DECIMAL(3,2) NOT NULL DEFAULT 4.80,
  reviews_count INT NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  features JSON,
  image_url VARCHAR(500) NOT NULL,
  badge VARCHAR(50),
  is_featured BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Orders & Order Items
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  shipping_amount DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Processing',
  payment_status ENUM('Paid', 'Pending', 'Failed') DEFAULT 'Paid',
  payment_method VARCHAR(50),
  shipping_address JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  image_url VARCHAR(500),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 5. Reviews
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

---

## ☁️ AWS Cloud Deployment Configuration

All AWS deployment templates, provisioning scripts, and security policies are organized in the `/aws` folder:

```
aws/
├── ec2/                  # IaaS Deployment
│   ├── ec2-user-data.sh  # Automated Ubuntu server bootstrap script
│   ├── nginx-nexacart.conf # Production Nginx reverse proxy
│   ├── nexacart.service  # Systemd service unit definition
│   └── README.md         # Step-by-step EC2 launch walkthrough
├── elastic-beanstalk/    # PaaS Deployment
│   ├── .ebextensions/    # Environment and container configuration
│   ├── Procfile          # Process execution definition
│   └── README.md         # EB CLI and console deployment guide
├── rds/                  # Managed Database
│   ├── rds-setup-guide.md # Multi-AZ, security group & subnet setup
│   └── backup-replication-policy.json
├── s3/                   # Object Storage
│   ├── s3-bucket-policy.json # Public-read & OAC policy
│   ├── cors-configuration.json # Cross-origin resource sharing
│   └── s3-setup-guide.md
├── security/             # Security, Auth & Auditing
│   ├── iam/              # Least-privilege IAM policies
│   ├── cognito/          # Cognito User Pool & JWT guide
│   ├── waf/              # AWS WAF WebACL anti-DDoS & SQLi rules
│   └── cloudtrail/       # Multi-region audit logging setup
└── k8s/                  # Kubernetes (Amazon EKS)
    ├── namespace.yaml
    ├── configmap.yaml
    ├── secrets.yaml
    ├── mysql-pv-pvc.yaml
    ├── mysql-deployment.yaml
    ├── backend-deployment.yaml
    ├── frontend-deployment.yaml
    ├── ingress.yaml
    ├── hpa.yaml
    └── README.md
```

### AWS Deployment Summary:
1. **EC2 (IaaS)**: Run Ubuntu 22.04 on `t3.medium`, attach Security Group allowing ports 22, 80, 443, paste `ec2-user-data.sh` into User Data, and configure systemd.
2. **Elastic Beanstalk (PaaS)**: Zip the repository with `Procfile` and `.ebextensions/`, run `eb create` or upload via the Beanstalk console on the Node.js 20 platform.
3. **RDS MySQL**: Create an Amazon RDS MySQL 8.0 instance in private subnets, configure `nexacart-rds-sg` to accept inbound port 3306 traffic only from EC2/EKS security groups.
4. **S3 Storage**: Bucket policy in `aws/s3/s3-bucket-policy.json` provides public asset read access and least-privilege write access for product media uploads.
5. **Security (IAM, Cognito, WAF, CloudTrail)**:
   - IAM least-privilege instance roles in `aws/security/iam/`.
   - Cognito User Pool setup for federated user authentication in `aws/security/cognito/`.
   - AWS WAF WebACL rules with SQLi protection and 500 req / 5 min IP rate limiting in `aws/security/waf/`.
   - CloudTrail multi-region immutable audit logging in `aws/security/cloudtrail/`.
6. **Docker & Kubernetes**: Multi-stage Dockerfiles for backend and frontend, and full K8s manifests with Horizontal Pod Autoscaling (HPA) and AWS ALB Ingress.

---

## 📡 REST API Reference

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Liveness and readiness probe for AWS ALB & K8s |
| `GET` | `/api/cloud-status` | Public | Diagnostic endpoint showing active AWS services |
| `POST` | `/api/auth/register` | Public | Create new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update phone, address, and avatar |
| `GET` | `/api/products` | Public | List products with search, category, sort filters |
| `GET` | `/api/products/categories` | Public | Retrieve product categories |
| `GET` | `/api/products/:idOrSlug` | Public | Product details with reviews |
| `POST` | `/api/products/:id/reviews` | Authenticated | Post product benchmark review |
| `POST` | `/api/products` | **Admin Only** | Deploy new hardware unit |
| `PUT` | `/api/products/:id` | **Admin Only** | Edit existing hardware specifications |
| `DELETE` | `/api/products/:id` | **Admin Only** | Delete hardware unit from inventory |
| `POST` | `/api/orders` | Authenticated | Place simulated order & authorize payment |
| `GET` | `/api/orders/my` | Authenticated | Retrieve customer's order history |
| `GET` | `/api/orders/admin/all` | **Admin Only** | View all client orders in system |
| `PUT` | `/api/orders/admin/:id/status`| **Admin Only** | Update order status (Shipped, Delivered, etc.) |
| `GET` | `/api/analytics/dashboard`| **Admin Only** | Aggregate sales metrics and category breakdown |
| `POST` | `/api/ai/recommend` | Public | Semantic AI silicon recommendation assistant |

---

## 🛡️ License

MIT License. Designed and engineered for NexaCart AI.

