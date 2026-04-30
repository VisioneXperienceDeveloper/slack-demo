# Technology Stack

This project is built as a high-performance, real-time monorepo using industry-standard tools for scalability and developer experience.

## Infrastructure & Tooling
- **Monorepo Manager**: [Turborepo](https://turbo.build/)
- **Frontend Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Backend-as-a-Service**: [Convex](https://convex.dev/) (Real-time database, serverless functions)
- **Authentication**: [Clerk](https://clerk.com/) (Identity management) + [Convex Auth](https://labs.convex.dev/auth)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: NPM (with Workspaces)

## Frontend Stack (`apps/web`)
- **React**: 19.x (Experimental/Next.js 16)
- **Styling**: Vanilla CSS Modules (Linear-inspired design system)
- **Components**: Shared UI components in `src/shared/components`

## Backend Stack (`convex/`)
- **Database**: Convex (NoSQL, transactional, real-time)
- **Functions**: Convex Queries and Mutations (Type-safe)
- **Hooks**: `useQuery`, `useMutation` from `convex/react`

## CI/CD & Automation
- **Branching**: `main` (Production), `feature/*` (Development).
- **Mandatory Checks**: `npm run lint`, `npm run test`, and `npm run build` must pass before any PR or push.

## Agent Skills
The project utilizes specialized AI agent skills for automation:
- **@add-docs**: (Current) Automated documentation management.
- **@gc**: Automated git staging and semantic committing.
- **@gpr**: Automated Pull Request creation on GitHub.

## Reference
- [Architecture](./architecture.md)
- [Design System](./design_system.md)
