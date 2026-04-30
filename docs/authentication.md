# Authentication

This project uses a hybrid authentication system combining **Clerk** for identity management and **Convex Auth** for secure database access.

## Architecture

1. **Clerk**: Handles sign-in, sign-up, user sessions, and social logins.
2. **Convex Auth**: Bridges Clerk's session with Convex's backend, allowing functions to identify the current user.
3. **Packages/Auth**: A shared package that provides the `Providers` component to wrap the application.

## User Syncing

Users are not automatically created in the Convex database when they sign up on Clerk. The following flow is used:
- When a user first lands on the app after Clerk authentication, a mutation (usually `users.sync`) is called.
- This mutation checks if the `externalId` exists in the `users` table.
- If not, it creates a new record with the data provided by Clerk.

## Secure Functions

Convex functions access the authenticated user via `ctx.auth.getUserIdentity()`. 
Example:
```typescript
const user = await ctx.auth.getUserIdentity();
if (!user) {
  throw new Error("Unauthorized");
}
// Proceed with logic using user.subject (the externalId)
```

## Protected Routes

- **Frontend**: Next.js middleware or high-level components check the Clerk session state.
- **Backend**: Every mutation or query that requires authentication checks the `identity` before executing logic.
