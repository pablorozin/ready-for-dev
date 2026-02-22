# ready-for-dev

![GitHub Issues](https://img.shields.io/github/issues/pablorozin/ready-for-dev)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/pablorozin/ready-for-dev)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

A demo project for practicing structured software development workflows using GitHub Issues, feature branches, and automated CI/CD pipelines. This repository serves as a sandbox for teams learning ticket-driven development, code review processes, and continuous integration best practices.

---

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 LTS |
| Language | TypeScript 5 |
| Framework | Express 4 |
| Logging | Morgan |
| Testing | Jest + Supertest |
| Linting | ESLint + Prettier |
| CI/CD | GitHub Actions |
| Package Manager | npm |

---

## Installation

**Prerequisites:** Node.js 20+ and npm 9+ must be installed.

```bash
# Clone the repository
git clone https://github.com/pablorozin/ready-for-dev.git
cd ready-for-dev

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

Edit `.env` with your local configuration before running the application.

---

## Usage

### Development server

```bash
npm run dev
```

The server starts at `http://localhost:3000` with hot reload enabled.

### Production build

```bash
npm run build
npm start
```

### Run tests

```bash
# Unit and integration tests
npm test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Lint and format

```bash
# Check for lint errors
npm run lint

# Auto-fix lint errors and format code
npm run lint:fix
```

---

## Project Structure

```
ready-for-dev/
├── src/
│   ├── routes/        # Express route handlers
│   ├── services/      # Business logic
│   ├── middleware/    # Custom middleware
│   └── index.ts       # Application entry point
├── tests/
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
├── .github/
│   └── workflows/     # GitHub Actions CI/CD
├── .env.example       # Environment variables template
├── package.json
└── tsconfig.json
```

---

## Contributing

1. Pick an Issue labeled `ready-for-dev` from the [Issues tab](https://github.com/pablorozin/ready-for-dev/issues).
2. Create a feature branch: `git checkout -b feature/issue-<number>-<short-description>`.
3. Implement the change and write tests.
4. Open a Pull Request referencing the Issue (e.g., `Closes #1`).
5. Wait for code review and CI checks to pass.

---

## License

This project is licensed under the [MIT License](LICENSE).
