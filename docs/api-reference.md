# API Reference

## Overview

The ready-for-dev API provides endpoints for system monitoring and future feature expansion. All endpoints return JSON responses and follow REST conventions.

## Base URL

- Development: `http://localhost:3000`
- Production: Configurable via environment variables

## Authentication

Currently no authentication is required. Future versions will implement:
- JWT token-based authentication
- Role-based access control
- API key authentication for service-to-service calls

## Health Check Endpoint

### GET /health

Returns the current health status of the application.

#### Request

```http
GET /health HTTP/1.1
Host: localhost:3000
Accept: application/json
```

#### Response

**Success Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "ok"
}
```

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | System health status. Currently always "ok" |

#### Example Usage

**cURL:**
```bash
curl -X GET http://localhost:3000/health
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:3000/health');
const healthData = await response.json();
console.log(healthData.status); // "ok"
```

**Node.js (axios):**
```javascript
const axios = require('axios');

const checkHealth = async () => {
  try {
    const response = await axios.get('http://localhost:3000/health');
    return response.data.status === 'ok';
  } catch (error) {
    return false;
  }
};
```

#### Use Cases

- **Load Balancer Health Checks**: Configure your load balancer to check this endpoint
- **Monitoring Systems**: Use for uptime monitoring and alerting
- **Deployment Verification**: Confirm service is running after deployment
- **Container Orchestration**: Kubernetes/Docker health check integration

#### Implementation Details

- **Stateless**: No dependencies on external services or databases
- **Fast Response**: Minimal processing time for quick health verification
- **Always Available**: Returns 200 OK when service is running
- **Standard Format**: JSON response suitable for programmatic consumption

## Response Patterns

### Success Responses

All successful API responses follow these patterns:

- **HTTP Status**: 200 OK (or appropriate 2xx status)
- **Content-Type**: `application/json`
- **Response Body**: Well-structured JSON object

### Error Responses (Future)

When error handling is implemented, responses will follow this pattern:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": {}
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET requests |
| 201 | Created | Successful POST requests (future) |
| 400 | Bad Request | Invalid request data (future) |
| 401 | Unauthorized | Authentication required (future) |
| 404 | Not Found | Resource not found (future) |
| 500 | Internal Server Error | Server-side errors (future) |

## Rate Limiting (Future)

When implemented, rate limiting will follow these patterns:

- **Default Limit**: 100 requests per minute per IP
- **Headers**: Rate limit information in response headers
- **Status Code**: 429 Too Many Requests when limit exceeded

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Request/Response Examples

### Health Check Integration Examples

**Docker Healthcheck:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

**Kubernetes Readiness Probe:**
```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
```

**Load Balancer Configuration (nginx):**
```nginx
upstream backend {
    server 127.0.0.1:3000;

    # Health check configuration
    check interval=3000 rise=2 fall=5 timeout=1000 type=http;
    check_http_send "GET /health HTTP/1.0\r\n\r\n";
    check_http_expect_alive http_2xx http_3xx;
}
```

**Monitoring Script:**
```bash
#!/bin/bash
# Simple health check script
HEALTH_URL="http://localhost:3000/health"

if curl -f -s "$HEALTH_URL" > /dev/null; then
    echo "Service is healthy"
    exit 0
else
    echo "Service is unhealthy"
    exit 1
fi
```

## Testing the API

### Automated Testing

The API includes comprehensive test coverage:

```typescript
// Example test pattern used
describe('Health Route', () => {
  test('GET /health should return status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
```

### Manual Testing

**Using HTTPie:**
```bash
http GET localhost:3000/health
```

**Using Postman:**
1. Create new GET request to `http://localhost:3000/health`
2. Send request
3. Verify 200 status and `{"status": "ok"}` response

**Using Browser:**
Navigate to `http://localhost:3000/health` to see JSON response.

## Future API Endpoints

The architecture is prepared for additional endpoints:

### User Management (Planned)
- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Authentication (Planned)
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token

### Application Features (Planned)
- Domain-specific endpoints based on requirements
- File upload/download capabilities
- Real-time features via WebSocket integration

## API Versioning Strategy (Future)

When versioning is needed:

- **URL Versioning**: `/v1/health`, `/v2/health`
- **Header Versioning**: `API-Version: 1.0`
- **Backward Compatibility**: Maintain older versions during transitions

## OpenAPI/Swagger Documentation (Future)

Future versions will include:
- Interactive API documentation
- Request/response schemas
- Code generation capabilities
- Automated testing integration

```yaml
# Example OpenAPI specification structure
openapi: 3.0.0
info:
  title: Ready for Dev API
  version: 1.0.0
paths:
  /health:
    get:
      summary: Health Check
      responses:
        '200':
          description: Service is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"
```