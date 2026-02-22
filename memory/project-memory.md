# Project Memory - ready-for-dev

This file contains the accumulated knowledge and patterns from implemented tickets.

## SEMANTIC MEMORY (Architecture Facts)

### Logging
**Domain**: middleware
**Added**: Issue #6 (2026-02-22)
**Fact**: System uses Morgan HTTP request logging middleware with format `:method :url :status :response-time ms`. Logging is conditionally disabled during tests via `process.env.NODE_ENV !== 'test'` check.

### Express Middleware Stack
**Domain**: middleware
**Updated**: Issue #6 (2026-02-22)
**Fact**: Middleware order is critical: Morgan logging → express.json() → route handlers. Morgan must be placed before routes to capture all request/response cycles.

### Testing Patterns
**Domain**: testing
**Added**: Issue #6 (2026-02-22)
**Fact**: Behavioral testing for middleware that affects stdout/stderr uses custom Writable streams to capture output. Pattern: Create separate Express app for isolated testing of middleware behavior.

## PROCEDURAL MEMORY (How to do things)

### Environment-Based Conditional Middleware
**Domain**: middleware
**Added**: Issue #6 (2026-02-22)
**Process**: Use `if (process.env.NODE_ENV !== 'test')` guard to conditionally apply middleware that affects testing. Place guard around middleware registration, not inside middleware function.

### Testing Logging Middleware
**Domain**: testing
**Added**: Issue #6 (2026-02-22)
**Process**:
1. Create custom Writable stream to capture log output
2. Create isolated Express app with middleware configured to write to custom stream
3. Make requests against isolated app
4. Assert both response correctness and log format
5. Use regex patterns to verify log format: `/^METHOD \/path STATUS \\d+(\\.\\d+)? ms$/`

### Middleware Testing Isolation
**Domain**: testing
**Added**: Issue #6 (2026-02-22)
**Process**: Test middleware behavior by creating separate Express app instances rather than mocking. This provides more realistic testing of middleware integration and HTTP flow.

## EPISODIC MEMORY (What happened in tickets)

### Issue #6: Add request logging middleware
**Date**: 2026-02-22
**Summary**: Added Morgan HTTP request logging middleware to Express server
**Technical Details**:
- Added `morgan` and `@types/morgan` dependencies
- Implemented conditional logging (disabled during tests)
- Used format: `:method :url :status :response-time ms`
- Created comprehensive test suite with behavioral verification
- All 5 tests pass, including log output format verification

**Key Decisions**:
- Chose Morgan over custom logging for HTTP requests (industry standard)
- Placed logging middleware before express.json() to ensure all requests are logged
- Used environment detection to prevent test interference
- Implemented behavioral testing approach for stdout-affecting middleware

**Files Modified**:
- `/home/pablo/ready-for-dev/src/index.ts` - Added Morgan middleware
- `/home/pablo/ready-for-dev/package.json` - Added dependencies
- `/home/pablo/ready-for-dev/src/__tests__/logging.test.ts` - New test file

**Testing Approach**:
- 4 tests total: normal processing, multiple requests, non-existent routes, log format verification
- Custom Writable stream pattern for capturing Morgan output
- Separate Express app for isolated middleware testing