# AWS RDS MySQL Deployment & Architecture Guide

Amazon Relational Database Service (RDS) provides a fully managed, high-availability MySQL 8.0 engine for **NexaCart AI**.

---

## 1. Creating the DB Subnet Group

1. Navigate to **RDS** > **Subnet groups** > **Create DB subnet group**.
2. **Name**: `nexacart-db-subnet-group`
3. **VPC**: Select your application VPC.
4. **Availability Zones**: Choose at least two AZs (e.g., `us-east-1a` and `us-east-1b`).
5. **Subnets**: Select private subnets (no direct public internet access for maximum security).

---

## 2. Configuring Database Security Group

1. Navigate to **VPC** > **Security groups** > **Create security group**.
2. **Name**: `nexacart-rds-sg`
3. **Inbound Rules**:
   - **Type**: MySQL/Aurora (Port 3306)
   - **Source**: Custom > Select the Security Group of your EC2 web instances, Beanstalk environment, or EKS Pods (`nexacart-app-sg`).
   - *(Never open port 3306 to `0.0.0.0/0` in production).*

---

## 3. Provisioning the RDS MySQL Instance

1. Go to **RDS** > **Databases** > **Create database**.
2. **Engine type**: **MySQL** (Version: 8.0.35+).
3. **Templates**: **Production** (Multi-AZ for high availability) or **Dev/Test**.
4. **Settings**:
   - **DB instance identifier**: `nexacart-mysql`
   - **Master username**: `admin`
   - **Master password**: Generate a secure 24-character password.
5. **Instance configuration**: `db.t3.medium` or `db.m6g.large`.
6. **Storage**:
   - **Storage type**: General Purpose SSD (`gp3`).
   - **Allocated storage**: 20 GiB (enable storage autoscaling up to 200 GiB).
7. **Connectivity**:
   - **VPC**: Choose your application VPC.
   - **DB Subnet Group**: `nexacart-db-subnet-group`.
   - **Public access**: **No**.
   - **VPC security group**: Choose `nexacart-rds-sg`.
8. **Additional configuration**:
   - **Initial database name**: `nexacart_db`
   - **DB parameter group**: Default or custom with `character_set_server = utf8mb4`.
   - **Automated backups**: Enable automated backups (7–30 day retention period).
   - **Backup window**: Low-traffic hours (e.g. 03:00 - 04:00 UTC).
   - **Enable encryption**: Yes (AWS KMS default key or custom customer managed key).
9. Click **Create database**.

---

## 4. Connecting and Seeding from EC2 or Bastion

Once RDS status turns to **Available**, copy the **Endpoint**:
`nexacart-mysql.c9xxxx.us-east-1.rds.amazonaws.com`

SSH into your EC2 instance or run the migration script:

```bash
# Connect using MySQL CLI
mysql -h nexacart-mysql.c9xxxx.us-east-1.rds.amazonaws.com -P 3306 -u admin -p nexacart_db < server/database/schema.sql
mysql -h nexacart-mysql.c9xxxx.us-east-1.rds.amazonaws.com -P 3306 -u admin -p nexacart_db < server/database/seed.sql

# Or automatically using Node:
cd server
DB_HOST=nexacart-mysql.c9xxxx.us-east-1.rds.amazonaws.com DB_USER=admin DB_PASSWORD=YourPassword DB_NAME=nexacart_db node database/init-db.js
```

---

## 5. Multi-AZ & Read Replicas (High Availability)

- **Multi-AZ Deployment**: Amazon RDS synchronously replicates data to a standby instance in a different AZ. In the event of planned maintenance or unplanned hardware interruption, Amazon RDS automatically fails over to the standby without administrative intervention.
- **Read Replicas**: For high read-throughput during hardware product launch drops, create up to 5 MySQL read replicas to offload catalogue queries (`GET /api/products`).

