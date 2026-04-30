# Architecture Overview

The project has evolved into a **Turborepo monorepo**, separating the application logic into distinct workspaces for better scalability and code reuse.

## Monorepo Structure

```text
.
├── apps/
│   └── web/            # Next.js 16 Web Application
├── convex/             # Backend logic (Schema, Mutations, Queries)
├── packages/
│   └── auth/           # Shared Authentication logic (Clerk + Convex)
├── docs/               # Project Documentation
└── turbo.json          # Turborepo configuration
```

## Core Components

### 1. Frontend (`apps/web`)
- Built with **Next.js 16 App Router**.
- **Vertical Slice Architecture** is maintained within the `src` directory:
  - `src/app`: Routing and layouts.
  - `src/features`: Feature-specific logic (e.g., workspaces, chat).
  - `src/shared`: Common components and utilities.

### 2. Backend (`convex/`)
- Handles all data persistence and real-time updates.
- **Schema-driven**: Defined in `convex/schema.ts`.
- **Serverless**: Business logic resides in query and mutation functions.

### 3. Authentication (`packages/auth`)
- Integrates **Clerk** for user identity and **Convex Auth** for database authorization.
- Provides a unified `AuthProvider` used by the web app.

## Data Flow
1. **User Action**: Triggered in the React frontend (`apps/web`).
2. **Convex Hook**: Frontend calls a mutation or query using `useMutation` or `useQuery`.
3. **Serverless Logic**: Convex executes the function, validating against the schema.
4. **Real-time Sync**: Changes are automatically pushed to all subscribed clients instantly.
