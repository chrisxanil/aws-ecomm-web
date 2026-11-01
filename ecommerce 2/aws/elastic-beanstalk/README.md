# AWS Elastic Beanstalk Deployment Guide (PaaS)

Amazon Elastic Beanstalk allows deploying and scaling **NexaCart AI** without manually provisioning EC2 instances, load balancers, or auto-scaling groups.

---

## 1. Prerequisites
- AWS Account with an active IAM user having Elastic Beanstalk permissions.
- AWS EB CLI installed (`pip install awsebcli`) or using the AWS Web Console.

---

## 2. Deploying via Elastic Beanstalk CLI

Initialize Elastic Beanstalk in the project root:

```bash
eb init -p node.js-20 nexacart-ai --region us-east-1
```

Create a production environment:

```bash
eb create nexacart-prod-env \
  --instance_type t3.medium \
  --min-instances 2 \
  --max-instances 4 \
  --elb-type application
```

Set production environment variables:

```bash
eb setenv \
  NODE_ENV=production \
  PORT=5001 \
  DB_HOST=nexacart-mysql.c9xxxx.us-east-1.rds.amazonaws.com \
  DB_USER=admin \
  DB_PASSWORD=YourSecureRDSPassword \
  DB_NAME=nexacart_db \
  JWT_SECRET=your-production-jwt-secret-string
```

Deploy the application:

```bash
eb deploy
```

Open the live URL:

```bash
eb open
```

---

## 3. Deploying via AWS Management Console (Zip Upload)

1. Build the frontend:
   ```bash
   npm run build:client
   ```
2. Create a zip archive containing:
   - `server/`
   - `client/dist/`
   - `package.json`
   - `Procfile`
   - `.ebextensions/`
3. Go to **AWS Console > Elastic Beanstalk > Create Application**.
4. Choose **Node.js** platform (Branch Node.js 20 on AL2023).
5. Select **Upload your code** and upload the created `.zip` file.
6. Under **Configuration > Environment properties**, enter `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `JWT_SECRET`.
7. Click **Create environment**.

