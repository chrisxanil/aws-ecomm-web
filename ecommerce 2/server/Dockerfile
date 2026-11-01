# =======================================================
# NexaCart AI - Backend Dockerfile
# Multi-stage production container
# =======================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for cached dependency layers
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Create unprivileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and application source
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Adjust permissions
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5001

# Healthcheck for container orchestrators (AWS ECS, Kubernetes, Docker Compose)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

CMD ["node", "server.js"]

