# AWS Cognito User Pool & Security Integration Guide

Amazon Cognito delivers identity management, multi-factor authentication (MFA), and federated sign-in for **NexaCart AI**.

---

## 1. Creating the Cognito User Pool

1. Go to **AWS Cognito** > **Create user pool**.
2. **Authentication providers**:
   - Provider types: **Cognito user pool**.
   - Sign-in options: **Email** (Users sign in with email address).
3. **Password policy**:
   - Minimum length: 8 characters.
   - Require numbers, special characters, uppercase, and lowercase letters.
4. **Multi-factor authentication (MFA)**:
   - Optional or Required (SMS or Authenticator Apps like Google Authenticator).
5. **User account recovery**:
   - Self-service account recovery via verified email.
6. **Required attributes**:
   - `name`, `email`.
7. **Email configuration**:
   - Send email with Amazon SES (production) or Cognito default email (testing).

---

## 2. Configuring the App Client

1. **App type**: **Single-page application (SPA)** or **Confidential client**.
2. **App client name**: `nexacart-spa-client`
3. **Client secret**: Don't generate a client secret for public browser clients.
4. **Authentication flows**:
   - `ALLOW_USER_PASSWORD_AUTH`
   - `ALLOW_REFRESH_TOKEN_AUTH`
   - `ALLOW_USER_SRP_AUTH`
5. **Token expiration**:
   - ID token: 1 hour.
   - Access token: 1 hour.
   - Refresh token: 30 days.

---

## 3. Express Backend Token Verification Architecture

When `ENABLE_AWS_COGNITO=true` is set in `server/.env`:

```env
ENABLE_AWS_COGNITO=true
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
```

Cognito issues JSON Web Tokens (JWT) signed using RS256 with keys from:
`https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json`

The middleware in `server/middleware/auth.js` verifies the token against Cognito's JWKS public keys, decodes the claims (`sub`, `email`, `cognito:groups`), and binds the authenticated principal to `req.user`.

