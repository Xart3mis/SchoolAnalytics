Conventions observed:
- TypeScript-first in web app and shared package boundaries
- Keep route handlers and lib helpers small and focused
- Prefer explicit validation and typed payload handling in API routes
- Use Prisma schema and generated client from packages/db
- Follow ESLint rules from Next.js/eslint configuration
- Use npm workspaces scripts from repository root for cross-package tasks