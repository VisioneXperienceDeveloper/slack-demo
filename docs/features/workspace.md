# Workspace Feature

The Workspace feature manages the high-level organization of the application, including onboarding, switching between workspaces, and member management.

## Components

- **WorkspaceOnboarding**: A guided flow for users to create their first workspace or join an existing one using a `joinCode`.
- **WorkspaceSidebar**: (Planned/Implementation) Navigation for channels and direct messages within a specific workspace.
- **WorkspaceSwitcher**: UI for users to jump between different workspaces they belong to.

## Backend Integration (`convex/workspaces.ts`)

- **Queries**: 
  - `workspaces.get`: Fetches information for a single workspace.
  - `workspaces.getForUser`: Returns all workspaces the current user is a member of.
- **Mutations**:
  - `workspaces.create`: Initializes a new workspace and sets the creator as the "owner".
  - `workspaces.join`: Validates a `joinCode` and adds the user as a "member".

## Member Roles

The workspace feature supports granular permissions through the `members` table:
- **Owner**: Full control over settings and deletion.
- **Admin**: Can manage channels and invite members.
- **Member**: Can participate in conversations and view workspace data.

## Implementation Details

- **Dynamic Routing**: Uses Next.js dynamic routes (`/workspace/[workspaceId]`) to scope data fetching to the active workspace.
- **Onboarding Guard**: High-level application logic redirects users to the onboarding flow if they don't have an active workspace.
