# Deployment Documentation

## Overview

This document describes the build and deployment processes for the ready-for-dev Node.js + TypeScript + Express application.

## Build Process

### Development Build

The development environment uses direct TypeScript execution without compilation:

```bash
# Development server with hot reload
npm run dev

# Uses ts-node to execute TypeScript directly
# No build artifacts created
# Fast iteration cycle
```

**Development Script Details:**
```json
{
  "scripts": {
    "dev": "ts-node src/index.ts"
  }
}
```

### Production Build

The production build compiles TypeScript to optimized JavaScript:

```bash
# Clean build process
npm run build

# Verification
npm start
```

**Build Script Details:**
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Build Output

```
dist/                           # Build output directory
├── routes/
│   └── health.js              # Compiled route handlers
├── routes/
│   └── health.d.ts            # TypeScript declarations
├── routes/
│   └── health.js.map          # Source maps for debugging
└── index.js                   # Main application entry point
    index.d.ts                 # Type declarations
    index.js.map               # Source maps
```

**Build Configuration (tsconfig.json):**
- **Target**: ES2020 for modern Node.js features
- **Module**: CommonJS for Node.js compatibility
- **Source Maps**: Enabled for production debugging
- **Declarations**: Generated for library usage
- **Strict Mode**: All type safety features enabled

## Environment Configuration

### Environment Variables

The application supports environment-based configuration:

```bash
# Development (default values)
PORT=3000
NODE_ENV=development

# Production (recommended)
PORT=8080
NODE_ENV=production
LOG_LEVEL=info
```

**Environment File Structure:**
```
.env                    # Local development (not in git)
.env.example            # Template for required variables
.env.production         # Production environment variables
```

### Environment Safety

**Sensitive Data Protection:**
- `.env` files excluded from git via `.gitignore`
- Environment variables never logged
- Secrets managed via external systems (future)

## Deployment Strategies

### Option 1: Docker Deployment (Recommended)

**Dockerfile (Future Implementation):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

**Docker Compose (Development):**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
    command: npm run dev
```

### Option 2: Platform-as-a-Service

**Heroku Deployment:**
```json
// package.json additions
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "heroku-postbuild": "npm run build"
  }
}
```

**Vercel Deployment:**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

### Option 3: Traditional Server Deployment

**PM2 Process Management:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ready-for-dev',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    }
  }]
};
```

**Systemd Service:**
```ini
[Unit]
Description=Ready for Dev Node.js App
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/ready-for-dev
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

## Health Checks and Monitoring

### Health Check Endpoint

The application provides a health check endpoint for deployment verification:

```bash
# Health check during deployment
curl -f http://localhost:3000/health

# Expected response
{"status":"ok"}
```

### Load Balancer Integration

**Nginx Configuration:**
```nginx
upstream backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://backend/health;
        access_log off;
    }
}
```

### Kubernetes Deployment

**Deployment Manifest:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ready-for-dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ready-for-dev
  template:
    metadata:
      labels:
        app: ready-for-dev
    spec:
      containers:
      - name: app
        image: ready-for-dev:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
```

## Performance Considerations

### Production Optimizations

**Node.js Optimizations:**
```bash
# Enable production optimizations
NODE_ENV=production

# Increase memory if needed
node --max-old-space-size=2048 dist/index.js

# Enable clustering (with PM2)
instances: 'max'
exec_mode: 'cluster'
```

**Express Optimizations:**
```typescript
// Production middleware (future)
if (process.env.NODE_ENV === 'production') {
  app.use(compression());  // gzip compression
  app.use(helmet());       // security headers
  app.set('trust proxy', 1); // reverse proxy trust
}
```

### Scaling Strategies

**Horizontal Scaling:**
- Load balancer with multiple instances
- Container orchestration (Kubernetes)
- Auto-scaling based on metrics

**Vertical Scaling:**
- Increase CPU and memory allocation
- Optimize Node.js heap size
- Monitor and adjust based on load

## Rollback Strategy

### Blue-Green Deployment

```bash
# Blue-green deployment script (example)
#!/bin/bash

# Build new version
npm run build

# Test new version
npm test
curl -f http://localhost:3001/health

# Switch traffic
# Update load balancer to point to new instance
# Keep old version running briefly for rollback

# Verify deployment
sleep 60
curl -f http://yourdomain.com/health

# If successful, shut down old version
# If failed, switch traffic back to old version
```

### Database Migrations (Future)

When database integration is added:

```bash
# Migration strategy
npm run migrate:up    # Apply new migrations
npm start            # Start new application version
# Monitor for issues
npm run migrate:down  # Rollback if needed
```

## Monitoring and Logging

### Application Logging (Future)

```typescript
// Structured logging implementation
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Metrics Collection (Future)

```typescript
// Application metrics
import prometheus from 'prom-client';

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});
```

## Security Considerations

### Production Security Checklist

- [ ] Environment variables properly secured
- [ ] Secrets not committed to git
- [ ] HTTPS enabled in production
- [ ] Security headers configured (helmet.js)
- [ ] Input validation implemented (future)
- [ ] Rate limiting configured (future)
- [ ] Dependencies regularly updated
- [ ] Security scanning in CI/CD (future)

### Network Security

```typescript
// Security middleware (future implementation)
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## Continuous Integration/Continuous Deployment

### GitHub Actions Workflow (Future)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test
    - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to production
      run: |
        # Deployment commands here
        echo "Deploying to production"
```

### Deployment Verification

```bash
# Post-deployment verification script
#!/bin/bash
set -e

echo "Verifying deployment..."

# Health check
if ! curl -f -s http://yourdomain.com/health > /dev/null; then
    echo "Health check failed"
    exit 1
fi

# Performance check
response_time=$(curl -o /dev/null -s -w '%{time_total}' http://yourdomain.com/health)
if (( $(echo "$response_time > 1.0" | bc -l) )); then
    echo "Response time too slow: ${response_time}s"
    exit 1
fi

echo "Deployment verification successful"
```

## Troubleshooting

### Common Deployment Issues

**Build Failures:**
```bash
# Clean node_modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port Conflicts:**
```bash
# Find process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=8080 npm start
```

**Memory Issues:**
```bash
# Increase Node.js heap size
node --max-old-space-size=2048 dist/index.js
```

**Health Check Failures:**
```bash
# Debug health endpoint
curl -v http://localhost:3000/health

# Check application logs
tail -f server.log
```

This deployment documentation provides a foundation for various deployment scenarios and can be extended as the application grows in complexity.