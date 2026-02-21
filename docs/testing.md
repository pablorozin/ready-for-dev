# Testing Documentation

## Overview

The ready-for-dev project implements comprehensive testing patterns using Jest and Supertest. This document describes the testing architecture, patterns, and best practices established.

## Testing Stack

| Tool | Purpose | Version |
|------|---------|---------|
| Jest | Test runner and assertion library | ^29.5.0 |
| Supertest | HTTP assertion library | ^6.3.3 |
| ts-jest | TypeScript integration for Jest | ^29.1.0 |
| @types/jest | TypeScript definitions | ^29.5.0 |
| @types/supertest | TypeScript definitions | ^2.0.12 |

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',                    // TypeScript support
  testEnvironment: 'node',              // Node.js environment
  roots: ['<rootDir>/src'],             // Test discovery root
  testMatch: [                          // Test file patterns
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [                // Coverage collection
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**'
  ]
};
```

### TypeScript Integration

Tests are written in TypeScript with full type safety:
- Type checking during test execution
- IntelliSense support in test files
- Compile-time error detection

## Testing Patterns

### Router Testing Pattern

**Standard Pattern for Route Testing:**

```typescript
import request from 'supertest';
import express from 'express';
import { routerModule } from '../route-file';

describe('Route Description', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/endpoint', routerModule);
  });

  test('should handle specific scenario', async () => {
    const response = await request(app)
      .get('/endpoint')
      .expect(200);

    expect(response.body).toEqual(expectedShape);
  });
});
```

### Benefits of This Pattern

1. **Isolation**: Each router tested independently
2. **Realistic**: Full HTTP request/response cycle
3. **Fast**: No server startup required
4. **Comprehensive**: Tests both routing and response format

## Current Test Implementation

### Health Route Tests

**File**: `src/routes/__tests__/health.test.ts`

```typescript
import request from 'supertest';
import express from 'express';
import { healthRouter } from '../health';

describe('Health Route', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/health', healthRouter);
  });

  test('GET /health should return status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
```

### Test Verification

**Running Tests:**
```bash
npm test

> ready-for-dev@1.0.0 test
> jest

PASS src/routes/__tests__/health.test.ts
  Health Route
    ✓ GET /health should return status ok (21ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.135 s
```

**Test Coverage**: Currently 100% of implemented functionality is tested.

## Test Organization

### File Structure

```
src/
├── routes/
│   ├── __tests__/              # Route-specific tests
│   │   └── health.test.ts      # Health route tests
│   └── health.ts               # Health route implementation
├── services/                   # Future business logic
│   └── __tests__/              # Service tests (future)
└── middleware/                 # Future middleware
    └── __tests__/              # Middleware tests (future)
```

### Naming Conventions

- Test files: `*.test.ts` or `*.spec.ts`
- Test directories: `__tests__/`
- Describe blocks: Describe the module being tested
- Test cases: Use "should" format describing expected behavior

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
test('should handle user creation', async () => {
  // Arrange: Setup test data
  const userData = { name: 'John', email: 'john@example.com' };

  // Act: Perform the action
  const response = await request(app)
    .post('/users')
    .send(userData);

  // Assert: Verify the outcome
  expect(response.status).toBe(201);
  expect(response.body).toMatchObject({
    name: 'John',
    email: 'john@example.com'
  });
});
```

### 2. Descriptive Test Names

```typescript
// Good: Describes behavior and context
test('should return 404 when user does not exist', async () => {});

// Good: Describes expected outcome
test('should validate email format before creating user', async () => {});

// Avoid: Vague or implementation-focused
test('should work', async () => {});
test('should call userService.create', async () => {});
```

### 3. Independent Tests

```typescript
// Good: Each test is independent
describe('User Routes', () => {
  beforeEach(() => {
    // Reset state for each test
  });

  test('should create user with valid data', async () => {
    // Test implementation
  });

  test('should reject invalid email', async () => {
    // Test implementation
  });
});
```

### 4. Test Data Management

```typescript
// Good: Use factories or builders for test data
const createValidUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
});

test('should create user', async () => {
  const userData = createValidUser();
  // Use userData in test
});

test('should reject duplicate email', async () => {
  const userData = createValidUser({ email: 'duplicate@example.com' });
  // Use userData in test
});
```

## Future Testing Enhancements

### Integration Tests

**Planned Structure:**
```
tests/
├── integration/
│   ├── api/                    # End-to-end API tests
│   ├── database/               # Database integration tests
│   └── services/               # Service integration tests
└── fixtures/                   # Test data and utilities
```

### Performance Tests

**Load Testing Pattern (Future):**
```typescript
// Using autocannon or similar
test('health endpoint should handle 1000 req/s', async () => {
  const results = await loadTest({
    url: 'http://localhost:3000/health',
    connections: 100,
    duration: 10
  });

  expect(results.requests.average).toBeGreaterThan(1000);
  expect(results.latency.p95).toBeLessThan(100);
});
```

### Contract Testing

**API Contract Testing (Future):**
```typescript
// Using Pact or OpenAPI validation
test('health endpoint should match OpenAPI spec', async () => {
  const response = await request(app).get('/health');

  expect(response).toMatchApiSpec(openApiSpec);
});
```

### Test Coverage Goals

| Component | Current Coverage | Target Coverage |
|-----------|-----------------|-----------------|
| Routes | 100% | 100% |
| Services | N/A | 95% |
| Middleware | N/A | 90% |
| Utilities | N/A | 95% |
| Overall | 100% | 90%+ |

## Running Tests

### Development Workflow

```bash
# Run all tests
npm test

# Run tests in watch mode (future)
npm run test:watch

# Run tests with coverage (future)
npm run test:coverage

# Run specific test file
npx jest health.test.ts

# Run tests matching pattern
npx jest --testNamePattern="health"
```

### Continuous Integration

**Future CI Integration:**
```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: |
    npm test
    npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v1
```

## Test Debugging

### Debug Configuration

**VS Code Launch Configuration:**
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### Common Debugging Patterns

```typescript
// Add debug output to tests
test('should debug response', async () => {
  const response = await request(app).get('/health');

  console.log('Response:', response.body);  // Debug output
  console.log('Status:', response.status);  // Debug output

  expect(response.status).toBe(200);
});

// Use Jest's --verbose flag for detailed output
// npx jest --verbose
```

## Testing Anti-Patterns to Avoid

### ❌ Testing Implementation Details

```typescript
// Bad: Testing internal implementation
test('should call express.Router', async () => {
  const spy = jest.spyOn(express, 'Router');
  // Don't test framework internals
});
```

### ❌ Slow Tests in Unit Test Suite

```typescript
// Bad: Real HTTP calls in unit tests
test('should call external API', async () => {
  const response = await fetch('https://api.external.com');
  // This belongs in integration tests
});
```

### ❌ Interdependent Tests

```typescript
// Bad: Tests that depend on each other
let userId;

test('should create user', async () => {
  const response = await createUser();
  userId = response.body.id;  // Don't share state
});

test('should get user', async () => {
  const response = await getUser(userId);  // Depends on previous test
});
```

## Summary

The testing architecture provides:

- **Comprehensive Coverage**: All functionality tested
- **Fast Execution**: Unit tests run quickly
- **Type Safety**: TypeScript integration prevents test errors
- **Realistic Testing**: Full HTTP request/response cycle
- **Maintainable**: Clear patterns and organization
- **Scalable**: Ready for additional test types and complexity

The established patterns ensure that new features can be tested consistently and thoroughly as the project grows.