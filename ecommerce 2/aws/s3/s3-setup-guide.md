# AWS S3 Storage & CloudFront Asset CDN Guide

Amazon Simple Storage Service (S3) provides scalable object storage for **NexaCart AI** product photography, silicon datasheets, and user avatar uploads.

---

## 1. Creating the S3 Bucket

1. Open **Amazon S3** > **Create bucket**.
2. **Bucket name**: `nexacart-assets-bucket` (must be globally unique).
3. **AWS Region**: `us-east-1` (same as EC2/RDS for minimal latency).
4. **Block Public Access settings**:
   - For direct public read on `/products/*`, uncheck "Block all public access" and acknowledge the warning.
   - Or, for best security, keep Block Public Access **ON** and distribute assets through **Amazon CloudFront** using **Origin Access Control (OAC)**.
5. **Bucket Versioning**: Enable (protects against accidental asset deletion).
6. **Default Encryption**: Server-side encryption with Amazon S3 managed keys (`SSE-S3`).
7. Click **Create bucket**.

---

## 2. Applying Bucket Policy and CORS

In the **Permissions** tab:
1. **Bucket Policy**: Copy and paste `aws/s3/s3-bucket-policy.json` (replace `nexacart-assets-bucket` with your actual bucket name).
2. **Cross-origin resource sharing (CORS)**: Copy and paste `aws/s3/cors-configuration.json`.

---

## 3. Configuring S3 in NexaCart AI Backend

Update `server/.env` with your bucket details:

```env
AWS_REGION=us-east-1
AWS_S3_BUCKET=nexacart-assets-bucket
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

When deployed on EC2 or Elastic Beanstalk, **do not hardcode access keys**; instead attach the IAM Role `NexaCartEC2AppRole` (see `aws/security/iam/ec2-app-role-policy.json`), and the AWS SDK will automatically retrieve temporary credentials via the instance metadata service (IMDSv2).

