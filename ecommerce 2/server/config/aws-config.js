/**
 * AWS Services Configuration & Integration Helper
 * 
 * Provides centralized status detection and client configuration for:
 * - AWS S3 (Media & Product Asset Storage)
 * - AWS RDS MySQL (Managed Database)
 * - AWS Cognito (User Authentication & Identity Pool)
 * - AWS CloudWatch / Health Checks
 */

export const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  s3: {
    bucketName: process.env.AWS_S3_BUCKET || '',
    enabled: Boolean(process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID),
    publicUrl: process.env.AWS_S3_BUCKET 
      ? `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`
      : null
  },
  rds: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'nexacart_db',
    user: process.env.DB_USER || 'root',
    isRds: Boolean(process.env.DB_HOST && process.env.DB_HOST.includes('.rds.amazonaws.com'))
  },
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID || '',
    clientId: process.env.COGNITO_CLIENT_ID || '',
    enabled: Boolean(process.env.COGNITO_USER_POOL_ID && process.env.ENABLE_AWS_COGNITO === 'true')
  },
  waf: {
    enabled: process.env.AWS_WAF_ENABLED === 'true'
  }
};

export const getCloudStatus = () => {
  return {
    environment: process.env.NODE_ENV || 'development',
    cloudPlatform: process.env.AWS_EXECUTION_ENV ? 'AWS Lambda / ECS' : (process.env.AWS_EB_ENVIRONMENT ? 'Elastic Beanstalk' : 'Local / EC2'),
    services: {
      rdsMySQL: {
        status: awsConfig.rds.isRds ? 'Connected (AWS RDS MySQL)' : 'Local / Docker MySQL',
        host: awsConfig.rds.host,
        configured: Boolean(process.env.DB_HOST)
      },
      s3Storage: {
        status: awsConfig.s3.enabled ? 'Active (AWS S3 Bucket)' : 'Local Asset Storage Mode',
        bucket: awsConfig.s3.bucketName || 'Not configured (using local assets)'
      },
      cognitoAuth: {
        status: awsConfig.cognito.enabled ? 'Active (AWS Cognito User Pool)' : 'Built-in JWT Auth Mode',
        userPoolId: awsConfig.cognito.userPoolId || 'Not configured'
      },
      wafSecurity: {
        status: awsConfig.waf.enabled ? 'Enforced (AWS WAF WebACL)' : 'Application Layer Rate Limiting'
      }
    }
  };
};

