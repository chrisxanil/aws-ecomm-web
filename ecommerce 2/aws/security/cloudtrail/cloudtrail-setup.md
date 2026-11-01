# AWS CloudTrail Security & Audit Logging Guide

AWS CloudTrail records API calls and user activity across your AWS account, providing immutable audit history for **NexaCart AI** infrastructure.

---

## 1. Creating the Production Multi-Region Trail

1. Go to **AWS CloudTrail** > **Trails** > **Create trail**.
2. **Trail name**: `nexacart-security-audit-trail`.
3. **Storage location**: Create a new S3 bucket `nexacart-cloudtrail-logs-vault` with SSE-KMS encryption.
4. **Log file SSE-KMS encryption**: Enabled.
5. **Log file validation**: **Enabled** (generates cryptographic digest files to detect unauthorized log file modifications or tampering).
6. **CloudWatch Logs integration**:
   - Check **Enabled**.
   - **Log group**: `/aws/cloudtrail/nexacart-audit`.
   - **IAM Role**: `CloudTrail_CloudWatchLogs_Role`.

---

## 2. Security Alarms and Monitoring with CloudWatch

Create CloudWatch metric filters and SNS notifications for critical security events:

### Alarm 1: Root Account Usage
Filter pattern:
```
{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }
```

### Alarm 2: Unauthorized API Calls (HTTP 403 / AccessDenied)
Filter pattern:
```
{ ($.errorCode = "*UnauthorizedOperation") || ($.errorCode = "AccessDenied*") }
```

### Alarm 3: Security Group Changes (Port 3306 or Port 22 Modifications)
Filter pattern:
```
{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup) }
```

