# Development Workflow

## Overview

This document describes the development workflow, npm scripts, and processes established for the ready-for-dev project.

## npm Scripts Reference

### Core Development Commands

| Command | Script | Purpose |
|---------|--------|---------|
| `npm run dev` | `ts-node src/index.ts` | Start development server with hot reload |
| `npm run build` | `tsc` | Compile TypeScript to JavaScript |
| `npm start` | `node dist/index.js` | Start production server |
| `npm test` | `jest` | Run all tests |

### Development Workflow

```bash
# Development cycle
npm install          # Install dependencies
npm run dev          # Start development server
# Make changes to TypeScript files
# Server automatically reloads
npm test            # Run tests
npm run build       # Build for production
npm start           # Test production build
```

## TypeScript Development

### Configuration

The project uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,               // All strict checks enabled
    "noImplicitAny": true,        // No implicit any types
    "strictNullChecks": true,     // Null safety
    "noUnusedLocals": true,       // Dead code detection
    "noUnusedParameters": true,   // Unused parameter detection
    "noImplicitReturns": true,    // All code paths return values
    "target": "ES2020",           // Modern JavaScript features
    "module": "commonjs",         // Node.js compatibility
    "outDir": "./dist",           // Compiled output directory
    "sourceMap": true             // Debug support
  }
}
```

### Development Patterns

**File Organization**:
- Each route gets its own module in `src/routes/`
- Tests co-located in `__tests__/` subdirectories
- Business logic prepared for `src/services/`
- Middleware ready for `src/middleware/`

**Naming Conventions**:
- Files: kebab-case (`health.ts`)
- Exports: camelCase (`healthRouter`)
- Types: PascalCase (future interfaces)

## Testing Workflow

### Test Structure

```typescript
// Pattern: Isolated router testing
describe('Route Name', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/endpoint', router);
  });

  test('should handle specific case', async () => {
    const response = await request(app).get('/endpoint');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedShape);
  });
});
```

### Test Execution

```bash
# Run all tests
npm test

# Run tests in watch mode (future)
npm run test:watch

# Generate coverage report (future)
npm run test:coverage
```

### Testing Best Practices

1. **Test Router Isolation**: Each router tested independently
2. **HTTP Behavior Focus**: Test actual HTTP requests/responses
3. **Expected Shape Validation**: Verify response structure
4. **Fast Execution**: No external dependencies in unit tests

## Build Process

### Development Build
- `ts-node` compiles and runs TypeScript directly
- No build artifacts created
- Fast iteration cycle
- Full TypeScript error reporting

### Production Build
```bash
npm run build
# Creates dist/ directory with:
# - Compiled JavaScript files
# - Declaration files (.d.ts)
# - Source maps for debugging
```

### Build Verification
```bash
npm run build
npm start
# Test that production build works correctly
```

## Code Organization Patterns

### Router Pattern
```typescript
// src/routes/feature.ts
import { Router } from 'express';

const featureRouter = Router();

featureRouter.get('/', handler);
featureRouter.post('/', handler);

export { featureRouter };
```

### Application Setup Pattern
```typescript
// src/index.ts
import express from 'express';
import { featureRouter } from './routes/feature';

const app = express();
app.use(express.json());
app.use('/feature', featureRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // For testing
```

### Test Pattern
```typescript
// src/routes/__tests__/feature.test.ts
import request from 'supertest';
import express from 'express';
import { featureRouter } from '../feature';

describe('Feature Route', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/feature', featureRouter);
  });

  test('should handle expected behavior', async () => {
    const response = await request(app)
      .get('/feature')
      .expect(200);

    expect(response.body).toMatchObject({
      expectedProperty: expectedValue
    });
  });
});
```

## Development Tools Integration

### TypeScript Integration
- Real-time type checking during development
- IDE integration with VS Code / other editors
- Error reporting in terminal and editor

### Hot Reload
- `ts-node` provides automatic restarts on file changes
- No manual build step required during development
- Fast feedback cycle for development

## Environment Configuration

### Development Environment
- Port: 3000 (configurable)
- TypeScript: Direct execution via ts-node
- Logging: Console output
- Hot reload: Enabled

### Production Environment
- Port: Configurable via environment variables (future)
- JavaScript: Compiled from TypeScript
- Logging: Structured logging (future)
- Process management: PM2/Docker (future)

## Git Workflow Integration

### Branch Strategy
- Feature branches: `feature/issue-<number>-<description>`
- Main branch protection
- Pull request workflow

### Commit Patterns
- Conventional commits format
- Co-authored commits with AI assistance
- Atomic commits per logical change

### Example Workflow
```bash
# Pick up a ticket
git checkout main
git pull origin main
git checkout -b feature/issue-4-new-endpoint

# Implement feature
npm run dev          # Start development
# Write code and tests
npm test            # Verify tests pass
npm run build       # Verify build works

# Commit and push
git add .
git commit -m "feat: add new endpoint with tests"
git push -u origin feature/issue-4-new-endpoint

# Create pull request
# Review and merge
```

## Performance Considerations

### Development Performance
- `ts-node` compilation cache
- Fast test execution with Jest
- Minimal dependency tree

### Production Performance
- Pre-compiled TypeScript
- Optimized for Node.js runtime
- No development dependencies in production

## Future Enhancements

### Planned Development Tools
- Linting: ESLint + Prettier configuration
- Pre-commit hooks: Automated code quality checks
- Watch mode: Continuous testing during development
- Coverage reporting: Test coverage metrics

### Production Enhancements
- Environment variable management
- Process monitoring and restart
- Health check integration with load balancers
- Structured logging and monitoring