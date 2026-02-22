# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- HTTP request logging middleware using Morgan
  - Format: `METHOD /path STATUS time_ms` (e.g., "GET /health 200 1.428 ms")
  - Environment-based conditional loading (disabled during tests)
  - Comprehensive test coverage including behavioral verification

### Changed
- Updated Express middleware stack to include Morgan logging
- Enhanced testing patterns for middleware that affects stdout

### Technical Details
- Added `morgan` and `@types/morgan` dependencies
- Implemented conditional middleware loading based on `NODE_ENV`
- Created custom Writable stream testing pattern for log capture
- Added isolated Express app testing approach for middleware verification

## [1.0.0] - 2026-02-22

### Added
- Initial Node.js + TypeScript + Express server setup
- Health check endpoint at `/health`
- Jest testing framework with Supertest integration
- TypeScript strict mode configuration
- Comprehensive project documentation
- Development workflow and architecture documentation

### Security
- Added comprehensive .gitignore to protect secrets and build artifacts